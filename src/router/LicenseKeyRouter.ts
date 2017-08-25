import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { LicenseKey } from "../entity/LicenseKey";
import { LicenseKeyDao } from "../dao/LicenseKeyDao";
import { ProductVariantDao } from "../dao/ProductVariantDao";
import { ProductVariantType } from "../entity/ProductVariant";
import { LicenseKeyEncoder } from "../util/LicenseKeyEncoder";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { SystemSetting, SystemSettingId } from "../entity/SystemSetting";
import * as moment from "moment";
import { ProductDao } from "../dao/ProductDao";
import { DomainList } from "../util/DomainList";
import { AuthRole, RestError } from "./BaseRouter";
import { PersonDao } from "../dao/PersonDao";
import { TopLevelDomainDao } from "../dao/TopLevelDomainDao";
import { NotificationBacklogItemDao } from "../dao/NotificationBacklogItemDao";

class LicenseKeyRouter extends CrudRouter<LicenseKey, LicenseKeyDao> {
    protected getDao(): LicenseKeyDao {
        return Container.get(LicenseKeyDao);
    }

    protected createEntity(requestBody: any): Promise<LicenseKey> {
        return new Promise((resolve, reject) => {
            resolve(new LicenseKey(requestBody));
        });
    }

    protected getDefaultAuthRole(): AuthRole {
        return AuthRole.ADMIN;
    }

    protected init(): void {
        super.init();
        this.addRouteGet('/my', this.my, AuthRole.CUSTOMER);
        this.addRouteGet('/mystats', this.myStats, AuthRole.CUSTOMER);
        this.addRouteGet('/getmyone/:id', this.getMyOne, AuthRole.CUSTOMER);
        this.addRoutePut('/assign', this.assign, AuthRole.ADMIN);
        this.addRoutePost('/generate', this.generate, AuthRole.ADMIN);
        this.addRoutePost('/issue/:id', this.issue, AuthRole.CUSTOMER);
    }

    protected myStats(req: Request, res: Response, next: NextFunction): void {
        let customerUuid = this.getJwtUserUuid(req);
        let dao: LicenseKeyDao = this.getDao();
        dao.getAllCustomerLicenses(customerUuid).then(licenses => {
            let numKeys = licenses.length;
            Container.get(SystemSettingDao).getInteger(SystemSettingId.NumDays_About_To_Expire, 0)
            .then(settingDayOffset => {
                Promise.all(licenses.map(license => {
                    return license.getDaysUntilExpiry();
                })).then(daysUntilExpiryArray => {
                    let numNearlyExpired = 0;
                    let numExpired = 0;
                    let numNotIssued = 0;
                    let numIssuedAndOkay = 0;
                    daysUntilExpiryArray.forEach(daysUntilExpiry => {
                        if (daysUntilExpiry != null) {
                            if (daysUntilExpiry < 0) {
                                numExpired++;
                            } else if (daysUntilExpiry <= settingDayOffset) {
                                numNearlyExpired++;
                            } else {
                                numIssuedAndOkay++;
                            }
                        } else {
                            numNotIssued++;
                        }
                    });
                    let result = {
                        numKeys: numKeys,
                        numNearlyExpired: numNearlyExpired,
                        numExpired: numExpired,
                        numNotIssued: numNotIssued,
                        numIssuedAndOkay: numIssuedAndOkay
                    };
                    res.send(result);
                });
            });
        });
    }

    protected getOne(req: Request, res: Response, next: NextFunction): void {
        let dao: LicenseKeyDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            if (entity) {
                this.sendOneItem(res, entity);
            } else {
                this.notFound(res);
            }
        }).catch(e => {
            // TODO Log exception
            this.internalServerError(res);
        });
    }

    protected getMyOne(req: Request, res: Response, next: NextFunction): void {
        let customerUuid = this.getJwtUserUuid(req);
        let dao: LicenseKeyDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            if (entity) {
                if (entity.customer && entity.customer.uuid === customerUuid) {
                    this.sendOneItem(res, entity);
                } else {
                    this.forbidden(res);
                }
            } else {
                this.notFound(res);
            }
        }).catch(e => this.notFound(res));
    }

    private sendOneItem(res: Response, entity: LicenseKey): void {
        if (entity.licenseKey) {
            this.getDomainRegexFromLicenseKey(entity.licenseKey).then(regex => {
                let dl: DomainList = new DomainList(regex);
                res.send(entity.serialize(false, dl.domains));
            });
        } else {
            res.send(entity.serialize());
        }
    }

    private getDomainRegexFromLicenseKey(licenseKey: string): Promise<string> {
        return Container.get(SystemSettingDao).getBySettingId(SystemSettingId.LicenseKey_PublicKey).then(publicKeySetting => {
            let encoder: LicenseKeyEncoder = LicenseKeyEncoder.factory(licenseKey, publicKeySetting.value);
            return encoder.subject;
        });
    }

    private my(req: Request, res: Response, next: NextFunction): void {
        let dao: LicenseKeyDao = this.getDao();
        let customerUuid = this.getJwtUserUuid(req);
        dao.getAllCustomerLicenses(customerUuid).then(entities => {
            res.send(entities.map(entity => entity.serialize()));
        });
    }

    private assign(req: Request, res: Response, next: NextFunction): void {
        let personDao: PersonDao = Container.get(PersonDao);
        let productVariantDao: ProductVariantDao = Container.get(ProductVariantDao);
        let dao: LicenseKeyDao = this.getDao();
        personDao.getByUuid(req.body.customerUuid).then(customer => {
            productVariantDao.getByUuid(req.body.productVariantUuid).then(productVariant => {
                let licenseKey: LicenseKey = new LicenseKey();
                licenseKey.customer = customer;
                licenseKey.productVariant = productVariant;
                dao.save(licenseKey).then(entity => {
                    this.saved(res, entity);
                });
            }).catch((e) => {
                this.badRequest(res);
            });
        }).catch((e) => {
            this.badRequest(res);
        });
    }

    private generate(req: Request, res: Response, next: NextFunction): void {
        let encoder: LicenseKeyEncoder = new LicenseKeyEncoder();
        let wildcard = false;
        if (req.body.wildcard) {
            wildcard = true;
        }
        this.getLicenseEncoderSubject(wildcard, req.body.domains).then(subject => {
            Container.get(ProductDao).getByUuid(req.body.productUuid).then(product => {
                Container.get(SystemSettingDao).getBySettingId(SystemSettingId.LicenseKey_PrivateKey).then(privateKeySetting => {
                    encoder.issueDate = new Date();
                    encoder.expiryDate = moment().add(req.body.validMonths, "months").toDate();
                    encoder.description = "License Key generated manually";
                    encoder.onlineVerification = req.body.onlineVerification;
                    encoder.owner = req.body.owner;
                    encoder.uuid = req.body.uuid;
                    encoder.product = product.licenseKeyIdentifier;
                    encoder.subject = subject;
                    encoder.type = req.body.type;
                    let licenseKey = encoder.toString(privateKeySetting.value);
                    res.status(200).send({
                        message: "Operation successful",
                        status: res.status,
                        licenseKey: licenseKey
                    });
                }).catch(e => this.internalServerError(res));
            }).catch(e => this.badRequest(res));
        }).catch(e => this.badRequest(res));
    }

    private issue(req: Request, res: Response, next: NextFunction): void {
        let dao: LicenseKeyDao = this.getDao();
        let id = req.params.id;
        let customerUuid = this.getJwtUserUuid(req);
        dao.getByUuid(id).then(entity => {
            if (entity.customer) {
                if (entity.customer.uuid === customerUuid) {
                    let domains: string[] = req.body.domains;
                    if (domains.length === entity.productVariant.numDomains) {
                        this.buildDomainList(domains).then(dl => {
                            let encoder: LicenseKeyEncoder = new LicenseKeyEncoder();
                            encoder.issueDate = new Date();
                            if (entity.productVariant.type === ProductVariantType.TrialLicense) {
                                encoder.expiryDate = moment().add(1, "months").toDate();
                            } else {
                                encoder.expiryDate = moment().add(entity.productVariant.numSupportYears, "years").toDate();
                            }
                            encoder.description = entity.productVariant.product.title +
                                " (" + entity.productVariant.numDomains + " domains)";
                            encoder.onlineVerification = false;
                            encoder.uuid = "";
                            encoder.owner = entity.customer.printableName();
                            encoder.product = entity.productVariant.product.licenseKeyIdentifier;
                            encoder.subject = dl.getRegex().source;
                            encoder.type = this.getTypeString(entity.productVariant.type);
                            Container.get(SystemSettingDao).getBySettingId(SystemSettingId.LicenseKey_PrivateKey)
                            .then(privateKeySetting => {
                                let licenseKey = encoder.toString(privateKeySetting.value);
                                entity.issueDate = encoder.issueDate;
                                entity.expiryDate = encoder.expiryDate;
                                entity.licenseKey = licenseKey;
                                dao.save(entity).then(entity => {
                                    Container.get(NotificationBacklogItemDao).createLicenseKeyItems(entity).then(() => {
                                        res.status(200).send({
                                            message: "Operation successful",
                                            status: res.status,
                                            licenseKey: licenseKey
                                        });
                                    });
                                });
                            });
                        }).catch(e => this.badRequest(res, RestError.INVALID_TLD));
                    } else {
                        this.badRequest(res);
                    }
                } else {
                    this.forbidden(res);
                }
            } else {
                this.forbidden(res);
            }
        }).catch(e => this.notFound(res));
    }

    private async buildDomainList(domains: string[]): Promise<DomainList> {
        let dao: TopLevelDomainDao = Container.get(TopLevelDomainDao);
        return new Promise<DomainList>((resolve, reject) => {
            Promise.all(domains.map(domain => {
                return new Promise<string>((resolve, reject) => {
                    if (domain) {
                        domain = domain.trim();
                        dao.isValidTld(domain).then(valid => {
                            if (!valid) {
                                let tld: string = DomainList.getTldFromDomain(domain);
                                if (tld) {
                                    dao.isValidTld(tld).then(valid => {
                                        if (valid) {
                                            resolve(domain);
                                        } else {
                                            reject(new Error("TLD '"+ tld +"' is not valid"));
                                        }
                                    });
                                } else {
                                    reject(new Error("TLD must not be empty"));
                                }
                            } else {
                                reject(new Error("Domain must not equal a TLD"));
                            }
                        });
                    } else {
                        reject(new Error("Domain must not be empty"));
                    }
                });
            })).then(domains => {
                let dl: DomainList = new DomainList();
                Container.get(SystemSettingDao).getString(SystemSettingId.LicenseKey_AutoIncludeDomains, "").then(autoIncludes => {
                    let autoIncludeTokens: string[] = autoIncludes.split("\n");
                    for (let domain of autoIncludeTokens) {
                        domain = domain.trim();
                        if (domain) {
                            dl.addDomain(domain, false, false);
                        }
                    }
                    for (let domain of domains) {
                        dl.addDomain(domain);
                    }
                    resolve(dl);
                });
            }).catch(e => reject(e));
        });
    }

    private getTypeString(type: ProductVariantType): string {
        if (type === ProductVariantType.LifetimeLicense) {
            return "lifetime";
        } else if (type === ProductVariantType.LimitedLicense) {
            return "limited";
        } else if (type === ProductVariantType.TrialLicense) {
            return "trial";
        } else {
            return "";
        }
    }

    private async getLicenseEncoderSubject(wildcard: boolean, domains?: string[]): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (wildcard) {
                resolve("^.*$");
            } else if (!wildcard && domains !== undefined && domains.length > 0) {
                let dl: DomainList = new DomainList();
                Container.get(SystemSettingDao).getString(SystemSettingId.LicenseKey_AutoIncludeDomains, "").then(autoIncludes => {
                    let autoIncludeTokens: string[] = autoIncludes.split("\n");
                    for (let domain of autoIncludeTokens) {
                        domain = domain.trim();
                        if (domain) {
                            dl.addDomain(domain, false, false);
                        }
                    }
                    for (let domain of domains) {
                        domain = domain.trim();
                        if (domain) {
                            dl.addDomain(domain);
                        }
                    }
                    resolve(dl.getRegex().source);
                });
            } else {
                resolve("");
            }
        });
    }
}

export default new LicenseKeyRouter().router;

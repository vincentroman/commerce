import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { LicenseKey } from "../entity/LicenseKey";
import { LicenseKeyDao } from "../dao/LicenseKeyDao";
import { CustomerDao } from "../dao/CustomerDao";
import { ProductVariantDao } from "../dao/ProductVariantDao";
import { ProductVariantType } from "../entity/ProductVariant";
import { LicenseKeyEncoder } from "../util/LicenseKeyEncoder";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { SystemSetting, SystemSettingId } from "../entity/SystemSetting";
import * as moment from "moment";
import { ProductDao } from "../dao/ProductDao";
import { DomainList } from "../util/DomainList";

class LicenseKeyRouter extends CrudRouter<LicenseKey, LicenseKeyDao> {
    protected getDao(): LicenseKeyDao {
        return Container.get(LicenseKeyDao);
    }

    protected createEntity(requestBody: any): Promise<LicenseKey> {
        return new Promise((resolve, reject) => {
            resolve(new LicenseKey(requestBody));
        });
    }

    protected init(): void {
        super.init();
        this.addRouteGet('/my', this.my);
        this.addRouteGet('/getmyone/:id', this.getMyOne);
        this.addRoutePut('/assign', this.assign);
        this.addRoutePost('/generate', this.generate);
        this.addRoutePost('/issue/:id', this.issue);
    }

    protected getMyOne(req: Request, res: Response, next: NextFunction): void {
        let customerUuid = this.getJwtCustomerUuid(req);
        let dao: LicenseKeyDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            if (entity.customer && entity.customer.uuid === customerUuid) {
                res.send(entity.serialize());
            } else {
                this.forbidden(res);
            }
        }).catch(e => this.notFound(res));
    }

    private my(req: Request, res: Response, next: NextFunction): void {
        let dao: LicenseKeyDao = this.getDao();
        let customerUuid = this.getJwtCustomerUuid(req);
        dao.getAllCustomerLicenses(customerUuid).then(entities => {
            res.send(entities.map(entity => entity.serialize()));
        });
    }

    private assign(req: Request, res: Response, next: NextFunction): void {
        let customerDao: CustomerDao = Container.get(CustomerDao);
        let productVariantDao: ProductVariantDao = Container.get(ProductVariantDao);
        let dao: LicenseKeyDao = this.getDao();
        customerDao.getByUuid(req.body.customerUuid).then(customer => {
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
        let subject: string = "";
        if (req.body.wildcard) {
            subject = "^.*$";
        } else {
            let domains: string[] = req.body.domains;
            let dl: DomainList = new DomainList(false);
            domains.forEach(domain => dl.addDomain(domain));
            subject = dl.getRegex().toString();
        }
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
            }).catch((e) => {
                this.internalServerError(res);
            });
        }).catch((e) => {
            this.badRequest(res);
        });
    }

    private issue(req: Request, res: Response, next: NextFunction): void {
        let dao: LicenseKeyDao = this.getDao();
        let id = req.params.id;
        let customerUuid = this.getJwtCustomerUuid(req);
        dao.getByUuid(id).then(entity => {
            if (entity.customer) {
                if (entity.customer.uuid === customerUuid) {
                    let domains: string[] = req.body.domains;
                    if (domains.length === entity.productVariant.numDomains) {
                        let encoder: LicenseKeyEncoder = new LicenseKeyEncoder();
                        let dl: DomainList = new DomainList(false);
                        domains.forEach(domain => dl.addDomain(domain));
                        encoder.issueDate = new Date();
                        if (entity.productVariant.type === ProductVariantType.TrialLicense) {
                            encoder.expiryDate = moment().add(1, "months").toDate();
                        } else {
                            encoder.expiryDate = moment().add(entity.productVariant.numSupportYears, "years").toDate();
                        }
                        encoder.description = entity.productVariant.product.title + " (" + entity.productVariant.numDomains + " domains)";
                        encoder.onlineVerification = false;
                        encoder.uuid = "";
                        encoder.owner = entity.customer.printableName();
                        encoder.product = entity.productVariant.product.licenseKeyIdentifier;
                        encoder.subject = dl.getRegex().toString();
                        encoder.type = this.getTypeString(entity.productVariant.type);
                        Container.get(SystemSettingDao).getBySettingId(SystemSettingId.LicenseKey_PrivateKey).then(privateKeySetting => {
                            let licenseKey = encoder.toString(privateKeySetting.value);
                            entity.issueDate = encoder.issueDate;
                            entity.expiryDate = encoder.expiryDate;
                            entity.licenseKey = licenseKey;
                            dao.save(entity).then(entity => {
                                res.status(200).send({
                                    message: "Operation successful",
                                    status: res.status,
                                    licenseKey: licenseKey
                                });
                            });
                        });
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
}

export default new LicenseKeyRouter().router;

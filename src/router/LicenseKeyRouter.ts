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
        this.addRoutePut('/assign', this.assign);
        this.addRoutePost('/generate', this.generate);
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
}

export default new LicenseKeyRouter().router;

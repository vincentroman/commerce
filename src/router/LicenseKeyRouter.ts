import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { LicenseKey } from "../entity/LicenseKey";
import { LicenseKeyDao } from "../dao/LicenseKeyDao";
import { CustomerDao } from "../dao/CustomerDao";
import { ProductVariantDao } from "../dao/ProductVariantDao";

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
}

export default new LicenseKeyRouter().router;

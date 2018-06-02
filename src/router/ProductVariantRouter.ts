import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { ProductVariant } from '../entity/ProductVariant';
import { ProductVariantDao } from '../dao/ProductVariantDao';
import { ProductDao } from "../dao/ProductDao";
import { AuthRole } from "./BaseRouter";

class ProductVariantRouter extends CrudRouter<ProductVariant, ProductVariantDao> {
    protected getDao(): ProductVariantDao {
        return Container.get(ProductVariantDao);
    }

    protected createEntity(requestBody: any): Promise<ProductVariant> {
        return new Promise((resolve, reject) => {
            let pv = new ProductVariant(requestBody);
            if (requestBody.product) {
                Container.get(ProductDao).getByUuid(requestBody.product.uuid).then(product => {
                    pv.product = product;
                    resolve(pv);
                });
            } else {
                resolve(pv);
            }
        });
    }

    protected getDefaultAuthRole(): AuthRole {
        return AuthRole.ADMIN;
    }
}

export default new ProductVariantRouter().router;

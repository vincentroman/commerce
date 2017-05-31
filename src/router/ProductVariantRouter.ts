import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { ProductVariant } from '../entity/ProductVariant';
import { ProductVariantDao } from '../dao/ProductVariantDao';

class ProductVariantRouter extends CrudRouter<ProductVariant, ProductVariantDao> {
    protected getDao(): ProductVariantDao {
        return Container.get(ProductVariantDao);
    }

    protected createEntity(requestBody: any): ProductVariant {
        return new ProductVariant(requestBody);
    }
}

export default new ProductVariantRouter().router;

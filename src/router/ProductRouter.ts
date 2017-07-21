import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { Product } from '../entity/Product';
import { ProductDao } from '../dao/ProductDao';
import { AuthRole } from "./BaseRouter";

class ProductRouter extends CrudRouter<Product, ProductDao> {
    protected getDao(): ProductDao {
        return Container.get(ProductDao);
    }

    protected createEntity(requestBody: any): Promise<Product> {
        return new Promise((resolve, reject) => {
            resolve(new Product(requestBody));
        });
    }

    protected getDefaultAuthRole(): AuthRole {
        return AuthRole.ADMIN;
    }
}

export default new ProductRouter().router;

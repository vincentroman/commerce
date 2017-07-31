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

    protected init(): void {
        this.addRouteGet('/get/:id', this.getOne, AuthRole.ANY);
        this.addRouteGet('/list', this.list, AuthRole.ANY);
        this.addRouteDelete('/delete/:id', this.delete, this.getDefaultAuthRole());
        this.addRoutePut('/save', this.save, this.getDefaultAuthRole());
    }
}

export default new ProductRouter().router;

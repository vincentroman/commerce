import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { Product } from '../entity/Product';
import { ProductDao } from '../dao/ProductDao';

class ProductRouter extends CrudRouter<Product, ProductDao> {
    protected getDao(): ProductDao {
        return Container.get(ProductDao);
    }
    protected createEntity(requestBody: any): Product {
        return new Product(requestBody);
    }
}

export default new ProductRouter().router;

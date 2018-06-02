import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { Product } from '../entity/Product';
import { ProductDao } from '../dao/ProductDao';
import { AuthRole } from "./BaseRouter";
import { ProductVariantDao } from '../dao/ProductVariantDao';

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
        this.addRouteGet('/:productId/variants', this.listVariantsForProduct, AuthRole.ANY);
        this.addRouteGet('/', this.list, AuthRole.ANY);
        this.addRouteGet('/:id', this.getOne, AuthRole.ANY);
        this.addRoutePost('/', this.create, this.getDefaultAuthRole());
        this.addRoutePut('/:id', this.update, this.getDefaultAuthRole());
        this.addRouteDelete('/:id', this.delete, this.getDefaultAuthRole());
    }

    private listVariantsForProduct(req: Request, res: Response, next: NextFunction): void {
        let dao: ProductVariantDao = Container.get(ProductVariantDao);
        let productId = req.params.productId;
        Container.get(ProductDao).getByUuid(productId).then(product => {
            if (product) {
                dao.getAllForProduct(product).then(entities => {
                    res.send(entities.map(entity => entity.serialize()));
                });
            } else {
                this.notFound(res);
            }
        }).catch(e => this.notFound(res));
    }
}

export default new ProductRouter().router;

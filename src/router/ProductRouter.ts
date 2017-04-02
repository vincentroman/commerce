import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter } from "./BaseRouter";

import { Product } from '../entity/Product';
import { ProductDao } from '../dao/ProductDao';

class ProductRouter extends BaseRouter {
    protected init(): void {
        this.router.get('/get/:id', this.getOne.bind(this));
        this.router.get('/list', this.list.bind(this));
        this.router.delete('/delete/:id', this.delete.bind(this));
        this.router.put('/save', this.save.bind(this));
    }

    private getOne(req: Request, res: Response, next: NextFunction): void {
        let dao: ProductDao = Container.get(ProductDao);
        let id = req.params.id;
        dao.getByUuid(id).then(product => {
            res.send(product.serialize());
        }).catch(e => this.notFound(res));
    }

    private list(req: Request, res: Response, next: NextFunction): void {
        let dao: ProductDao = Container.get(ProductDao);
        dao.getAll().then(products => {
            res.send(products.map(product => product.serialize()));
        });
    }

    private delete(req: Request, res: Response, next: NextFunction): void {
        let dao: ProductDao = Container.get(ProductDao);
        let id = req.params.id;
        dao.getByUuid(id).then(product => {
            dao.delete(product).then(product => {
                this.ok(res);
            });
        }).catch(e => this.notFound(e));
    }

    private save(req: Request, res: Response, next: NextFunction): void {
        let dao: ProductDao = Container.get(ProductDao);
        if (req.body.uuid) {
            dao.getByUuid(req.body.uuid).then(product => {
                product.deserialize(req.body);
                dao.save(product).then(product => {
                    this.saved(res, product);
                });
            }).catch(e => this.notFound(res));
        } else {
            let product: Product = new Product(req.body);
            dao.save(product).then(product => {
                this.saved(res, product);
            });
        }
    }
}

export default new ProductRouter().router;

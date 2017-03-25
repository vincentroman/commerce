import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";

import { Product } from '../entity/Product';
import { ProductDao } from '../dao/ProductDao';

class ProductRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/save', this.save.bind(this));
    }

    private save(req: Request, res: Response, next: NextFunction): void {
        let productDao: ProductDao = Container.get(ProductDao);

        let p1 = new Product();
        p1.title = "1, 2, polizei";

        let p2 = new Product();
        p2.title = "3, 4, Grenadier!";

        productDao.save(p1);
        productDao.save(p2);

        res.send({});
    }

    private getAll(req: Request, res: Response, next: NextFunction): void {
        let all = ['1abc'];
        res.send(all);
    }
}

export default new ProductRouter().router;

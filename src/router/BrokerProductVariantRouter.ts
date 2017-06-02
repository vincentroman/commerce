import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter } from "./BaseRouter";

import { Dao } from '../dao/Dao';
import { DbEntity } from '../entity/DbEntity';
import { BrokerProductVariantDao } from "../dao/BrokerProductVariantDao";
import { ProductDao } from "../dao/ProductDao";

class BrokerProductVariantRouter extends BaseRouter {

    protected init(): void {
        this.addRouteGet('/:productId/list', this.list);
        this.addRoutePut('/:productId/saveall', this.saveAll);
    }

    private list(req: Request, res: Response, next: NextFunction): void {
        let productDao: ProductDao = Container.get(ProductDao);
        let dao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        let productId = req.params.productId;
        productDao.getByUuid(productId).then(product => {
            dao.getByProduct(product).then(entities => {
                res.send(entities.map(entity => entity.serialize()));
            });
        }).catch(e => this.notFound(res));;
    }

    private saveAll(req: Request, res: Response, next: NextFunction): void {
        let productDao: ProductDao = Container.get(ProductDao);
        let dao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        let productId = req.params.productId;
        /*
        if (req.body.uuid) {
            dao.getByUuid(req.body.uuid).then(entity => {
                entity.deserialize(req.body);
                dao.save(entity).then(entity => {
                    this.saved(res, entity);
                });
            }).catch(e => this.notFound(res));
        } else {
            let entity: TEntity = this.createEntity(req.body);
            dao.save(entity).then(entity => {
                this.saved(res, entity);
            });
        }
        */
    }
}

export default new BrokerProductVariantRouter().router;

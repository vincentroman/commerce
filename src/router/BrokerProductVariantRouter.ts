import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter } from "./BaseRouter";

import { Dao } from '../dao/Dao';
import { DbEntity } from '../entity/DbEntity';
import { BrokerProductVariantDao } from "../dao/BrokerProductVariantDao";
import { ProductDao } from "../dao/ProductDao";
import { BrokerProductVariant } from "../entity/BrokerProductVariant";
import { BrokerDao } from "../dao/BrokerDao";
import { ProductVariantDao } from "../dao/ProductVariantDao";

class BrokerProductVariantRouter extends BaseRouter {

    protected init(): void {
        this.addRouteGet('/:productId/list', this.list);
        this.addRoutePut('/:productId/save', this.save);
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

    private save(req: Request, res: Response, next: NextFunction): void {
        Container.get(BrokerDao).getByUuid(req.body.broker.uuid).then(broker => {
            Container.get(ProductVariantDao).getByUuid(req.body.productVariant.uuid).then(productVariant => {
                Container.get(BrokerProductVariantDao).addOrReplace(broker, productVariant, req.body.idForBroker).then(bpv => {
                    this.saved(res, bpv);
                });
            }).catch(e => {
                this.notFound(res);
            });
        }).catch(e => {
            this.notFound(res);
        });
    }
}

export default new BrokerProductVariantRouter().router;

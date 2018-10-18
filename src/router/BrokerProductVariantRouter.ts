import { Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter, AuthRole } from "./BaseRouter";

import { BrokerProductVariantDao } from "../dao/BrokerProductVariantDao";
import { ProductDao } from "../dao/ProductDao";
import { BrokerDao } from "../dao/BrokerDao";
import { ProductVariantDao } from "../dao/ProductVariantDao";

class BrokerProductVariantRouter extends BaseRouter {
    protected init(): void {
        this.addRouteGet('/:variantId/:brokerId/get', this.getOne, AuthRole.ADMIN);
        this.addRouteGet('/:productId/list', this.list, AuthRole.ADMIN);
        this.addRoutePut('/:productId/save', this.save, AuthRole.ADMIN);
        this.addRouteGet('/assistant', this.assistant, AuthRole.ANY);
    }

    private assistant(req: Request, res: Response): void {
        let dao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        dao.getAllWithUrl().then(entities => {
            res.send(entities.map(entity => {
                let result = {
                    product: {
                        uuid: (entity && entity.productVariant && entity.productVariant.product ? entity.productVariant.product.uuid : ""),
                        title: (entity && entity.productVariant && entity.productVariant.product ? entity.productVariant.product.title : "")
                    },
                    variant: {
                        uuid: (entity && entity.productVariant ? entity.productVariant.uuid : ""),
                        title: (entity && entity.productVariant ? entity.productVariant.title : "")
                    },
                    broker: {
                        uuid: (entity && entity.broker ? entity.broker.uuid : ""),
                        title: (entity && entity.broker ? entity.broker.name : "")
                    },
                    type: (entity && entity.productVariant ? entity.productVariant.type : ""),
                    url: (entity ? entity.url : "")
                };
                return result;
            }));
        }).catch(() => this.notFound(res));
    }

    private getOne(req: Request, res: Response): void {
        let variantDao: ProductVariantDao = Container.get(ProductVariantDao);
        let brokerDao: BrokerDao = Container.get(BrokerDao);
        let dao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        let brokerId = req.params.brokerId;
        let variantId = req.params.variantId;
        variantDao.getByUuid(variantId).then(variant => {
            brokerDao.getByUuid(brokerId).then(broker => {
                if (variant && broker) {
                    dao.getByBrokerProductVariant(broker, variant).then(bpv => {
                        if (bpv) {
                            res.send(bpv.serialize());
                        } else {
                            this.notFound(res);
                        }
                    });
                } else {
                    this.notFound(res);
                }
            }).catch(() => this.notFound(res));
        }).catch(() => this.notFound(res));
    }

    private list(req: Request, res: Response): void {
        let productDao: ProductDao = Container.get(ProductDao);
        let dao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        let productId = req.params.productId;
        productDao.getByUuid(productId).then(product => {
            if (product) {
                dao.getByProduct(product).then(entities => {
                    res.send(entities.map(entity => entity.serialize()));
                });
            } else {
                this.notFound(res);
            }
        }).catch(() => this.notFound(res));
    }

    private save(req: Request, res: Response): void {
        if (req.body.broker && req.body.broker.uuid) {
            Container.get(BrokerDao).getByUuid(req.body.broker.uuid).then(broker => {
                if (broker) {
                    Container.get(ProductVariantDao).getByUuid(req.body.productVariant.uuid).then(productVariant => {
                        if (productVariant) {
                            Container.get(BrokerProductVariantDao).addOrReplace(broker, productVariant, req.body.idForBroker).then(bpv => {
                                if (bpv) {
                                    bpv.url = req.body.url;
                                    Container.get(BrokerProductVariantDao).save(bpv).then(bpv => this.updated(res, bpv));
                                } else {
                                    this.updated(res, bpv);
                                }
                            }).catch(() => this.internalServerError(res));
                        } else {
                            this.notFound(res);
                        }
                    }).catch(() => {
                            this.notFound(res);
                        });
                } else {
                    this.notFound(res);
                }
            }).catch(() => {
                    this.notFound(res);
                });
        } else {
            this.badRequest(res);
        }
    }
}

export default new BrokerProductVariantRouter().router;

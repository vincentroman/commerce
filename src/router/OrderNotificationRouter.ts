import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter } from "./BaseRouter";
import { Broker } from "../entity/Broker";
import { BrokerDao } from "../dao/BrokerDao";
import { OrderDao } from "../dao/OrderDao";
import { OrderNotificationMapper } from "../util/OrderNotificationMapper";

class OrderNotificationRouter extends BaseRouter {
    protected init(): void {
        this.addRoutePost('/:id', this.notify);
    }

    private notify(req: Request, res: Response, next: NextFunction): void {
        let brokderId = req.params.id;
        let brokerDao: BrokerDao = Container.get(BrokerDao);
        brokerDao.getByUuid(brokderId).then((broker) => {
            OrderNotificationMapper.map(req.body, broker, true).then((order) => {
                // TODO Post Order Triggers
                this.saved(res, order);
            }).catch(e => {console.error(e); this.badRequest(res)});
        }).catch(e => this.notFound(res));
    }
}

export default new OrderNotificationRouter().router;

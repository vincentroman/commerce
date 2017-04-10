import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter } from "./BaseRouter";
import { Broker } from "../entity/Broker";
import { BrokerDao } from "../dao/BrokerDao";
import { OrderDao } from "../dao/OrderDao";
import { OrderNotificationMapper } from "../util/OrderNotificationMapper";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { ProductVariant, ProductVariantType } from "../entity/ProductVariant";

class OrderNotificationRouter extends BaseRouter {
    protected init(): void {
        this.addRoutePost('/:id', this.notify);
    }

    private notify(req: Request, res: Response, next: NextFunction): void {
        let brokderId = req.params.id;
        let brokerDao: BrokerDao = Container.get(BrokerDao);
        brokerDao.getByUuid(brokderId).then((broker) => {
            OrderNotificationMapper.map(req.body, broker, true).then((order) => {
                this.checkOrderTriggers(order).then(() => {
                    this.saved(res, order);
                });
            }).catch(e => this.badRequest(res));
        }).catch(e => this.notFound(res));
    }

    private checkOrderTriggers(order: Order): Promise<void[]> {
        let process: Promise<void>[] = order.items.map((item) => {
            return this.checkOrderItemTriggers(item);
        });
        return Promise.all<void>(process);
    }

    private checkOrderItemTriggers(item: OrderItem): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let productVariant: ProductVariant = item.productVariant;
            let type: ProductVariantType = productVariant.type;
            if (type === ProductVariantType.Eval) {
                // TODO Send Buy reminder
            } else if (type === ProductVariantType.LifetimeLicense) {
                // TODO Create License Request & Send Mail
            } else if (type === ProductVariantType.LimitedLicense) {
                // TODO Create License Request & Send Mail
            } else if (type === ProductVariantType.SupportTicket) {
                // TODO Create Support Ticket Request & Send Mail
            } else if (type === ProductVariantType.TrialLicense) {
                // TODO Create License Request & Send Mail
            }
            resolve();
        });
    }
}

export default new OrderNotificationRouter().router;

import * as str1n9 from 'str1n9';
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
import { LicenseKey } from "../entity/LicenseKey";
import { LicenseKeyDao } from "../dao/LicenseKeyDao";
import { Customer } from "../entity/Customer";
import { User } from "../entity/User";
import { UserDao } from "../dao/UserDao";
import { SupportTicket } from "../entity/SupportTicket";
import { SupportTicketDao } from "../dao/SupportTicketDao";

class OrderNotificationRouter extends BaseRouter {
    protected init(): void {
        this.addRoutePost('/:id', this.notify);
    }

    private notify(req: Request, res: Response, next: NextFunction): void {
        let brokderId = req.params.id;
        let brokerDao: BrokerDao = Container.get(BrokerDao);
        brokerDao.getByUuid(brokderId).then((broker) => {
            OrderNotificationMapper.map(req.body, broker, true).then((order) => {
                this.checkCreateUserAccount(order.customer).then(() => {
                    this.checkOrderTriggers(order).then(() => {
                        this.saved(res, order);
                    });
                });
            }).catch(e => this.badRequest(res));
        }).catch(e => this.notFound(res));
    }

    private checkCreateUserAccount(customer: Customer): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            let userDao: UserDao = Container.get(UserDao);
            userDao.getByEmail(customer.email)
            .then(user => resolve(user))
            .catch(e => {
                let user: User = new User();
                let plainPassword: string = str1n9.randomString(12, 'cln');
                user.customer = customer;
                user.email = customer.email;
                user.setPlainPassword(plainPassword).then(() => {
                    userDao.save(user).then((user) => {
                        // TODO send mail with login data
                        resolve(user);
                    }).catch(e => reject(e));
                }).catch(e => reject(e));
            });
        });
    }

    private checkOrderTriggers(order: Order): Promise<void[]> {
        let process: Promise<void>[] = order.items.map((item) => {
            item.order = order;
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
                this.createLicenseKeyRequest(item).then(licenseKey => {
                    // TODO Send Mail
                    resolve();
                }).catch(e => reject());
            } else if (type === ProductVariantType.LimitedLicense) {
                this.createLicenseKeyRequest(item).then(licenseKey => {
                    // TODO Send Mail
                    resolve();
                }).catch(e => reject());
            } else if (type === ProductVariantType.TrialLicense) {
                this.createLicenseKeyRequest(item).then(licenseKey => {
                    // TODO Send Mail
                    resolve();
                }).catch(e => reject());
            } else if (type === ProductVariantType.SupportTicket) {
                this.createSupportRequest(item).then(supportTicket => {
                    // TODO Send Mail
                    resolve();
                }).catch(e => reject());
            }
            resolve();
        });
    }

    private createLicenseKeyRequest(item: OrderItem): Promise<LicenseKey> {
        let licenseKeyDao: LicenseKeyDao = Container.get(LicenseKeyDao);
        let key: LicenseKey = new LicenseKey();
        key.orderItem = item;
        key.customer = item.order.customer;
        key.productVariant = item.productVariant;
        return licenseKeyDao.save(key);
    }

    private createSupportRequest(item: OrderItem): Promise<SupportTicket> {
        let supportTicketDao: SupportTicketDao;
        let ticket = new SupportTicket();
        ticket.orderItem = item;
        ticket.customer = item.order.customer;
        ticket.productVariant = item.productVariant;
        return supportTicketDao.save(ticket);
    }
}

export default new OrderNotificationRouter().router;

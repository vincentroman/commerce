import * as pwGen from 'generate-password';
import { Request, Response } from 'express';
import { Container } from "typedi";
import { BaseRouter, AuthRole } from "./BaseRouter";
import { Broker, BrokerSecurityType } from "../entity/Broker";
import { BrokerDao } from "../dao/BrokerDao";
import { OrderNotificationMapper, MappedOrderInput } from "../util/OrderNotificationMapper";
import { Purchase } from "../entity/Purchase";
import { PurchaseItem } from "../entity/PurchaseItem";
import { ProductVariant, ProductVariantType } from "../entity/ProductVariant";
import { LicenseKey } from "../entity/LicenseKey";
import { LicenseKeyDao } from "../dao/LicenseKeyDao";
import { SupportTicket, SupportRequestStatus } from "../entity/SupportTicket";
import { SupportTicketDao } from "../dao/SupportTicketDao";
import { MailTemplateDao } from "../dao/MailTemplateDao";
import { MailTemplateType } from "../entity/MailTemplate";
import { Email, Address } from "../util/Email";
import { Person } from "../entity/Person";
import { PersonDao } from "../dao/PersonDao";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { SystemSettingId } from "../entity/SystemSetting";
import { PendingAction, ActionType } from '../entity/PendingAction';
import { PendingActionDao } from '../dao/PendingActionDao';
import { Log } from '../util/Log';
import { LogEntryType } from '../entity/LogEntry';
import { Md5 } from 'ts-md5/dist/md5';

class OrderNotificationRouter extends BaseRouter {
    protected init(): void {
        this.addRoutePost('/confirm', this.confirmOrder, AuthRole.ANY);
        this.addRoutePost('/:id', this.notify, AuthRole.ANY);
    }

    private notify(req: Request, res: Response): void {
        let brokerId = req.params.id;
        let brokerDao: BrokerDao = Container.get(BrokerDao);
        Log.info("Incoming order notification" +
            " for broker uuid " + brokerId +
            " with content: " + JSON.stringify(req.body),
            LogEntryType.Order);
        brokerDao.getByUuid(brokerId).then((broker) => {
            if (broker) {
                OrderNotificationMapper.mapAndValidate(req.body, broker).then(mappedInput => {
                    if (this.isValidSecurityToken(broker, mappedInput, req)) {
                        Container.get(PersonDao).existsPerson(mappedInput.customer.email).then(customerExists => {
                            if (customerExists) {
                                Log.info("Customer for order notification already exists," +
                                    " continuing without double opt in" +
                                    " for broker uuid " + brokerId +
                                    " with content: " + JSON.stringify(req.body),
                                    LogEntryType.Order);
                                this.processPurchaseWithoutDoubleOptIn(mappedInput, broker)
                                    .then(order => this.created(res, order))
                                    .catch(() => this.internalServerError(res));
                            } else {
                                Log.info("Customer for order notification does not exist," +
                                    " initiating double opt in" +
                                    " for broker uuid " + brokerId +
                                    " with content: " + JSON.stringify(req.body),
                                    LogEntryType.Order);
                                this.startDoubleOptInForPurchase(mappedInput, broker)
                                    .then(() => this.ok(res))
                                    .catch(() => this.internalServerError(res));
                            }
                        });
                    } else {
                        console.log("Invalid security token for broker %s", brokerId);
                        this.forbidden(res);
                    }
                }).catch(e => {
                    console.log("Order Notification Mapping failed: " + e.stack);
                    this.badRequest(res);
                });
            } else {
                console.log("No such broker: %s", brokerId);
                this.notFound(res);
            }
        }).catch(() => this.notFound(res));
    }

    private isValidSecurityToken(broker: Broker, mappedInput: MappedOrderInput, req: Request): boolean {
        console.log("Checking broker security type %d for broker %s", broker.securityType, broker.uuid);
        if (broker.securityType === BrokerSecurityType.None || !broker.securityType) {
            return true;
        } else if (broker.securityType === BrokerSecurityType.HttpRequestHeader) {
            let headerValue = req.header(broker.securityKey);
            return (broker.securityMatchValue === headerValue);
        } else if (broker.securityType === BrokerSecurityType.JsonPath) {
            return (broker.securityMatchValue === mappedInput.securityToken);
        } else if (broker.securityType === BrokerSecurityType.FastSpring) {
            let securityData = req.header("x-security-data");
            let securityHash = req.header("x-security-hash");
            let md5 = Md5.hashAsciiStr(securityData + broker.securityMatchValue);
            return (md5 === securityHash);
        }
        return false;
    }

    private confirmOrder(req: Request, res: Response): void {
        let actionDao: PendingActionDao = Container.get(PendingActionDao);
        actionDao.getByUuid(req.body.uuid).then(action => {
            if (action && action.type === ActionType.ConfirmOrder) {
                Container.get(BrokerDao).getByUuid(action.getPayload().brokerUuid).then(broker => {
                    if (broker) {
                        let mappedInput: MappedOrderInput = action.getPayload().mappedInput;
                        this.processPurchaseWithoutDoubleOptIn(mappedInput, broker).then(order => {
                            Log.info("Confirming order " + order.uuid +
                                " for customer " + order.customer.uuid +
                                " from ip " + req.ip,
                                LogEntryType.OptIn);
                            actionDao.delete(action).then(() => this.updated(res, order));
                        }).catch(() => this.internalServerError(res));
                    } else {
                        this.internalServerError(res);
                    }
                }).catch(() => this.internalServerError(res));
            } else {
                this.notFound(res);
            }
        }).catch(() => this.internalServerError(res));
    }

    private processPurchaseWithoutDoubleOptIn(mappedInput: MappedOrderInput, broker: Broker): Promise<Purchase> {
        return new Promise<Purchase>((resolve, reject) => {
            OrderNotificationMapper.persistMappedOrder(mappedInput, broker).then((order) => {
                this.checkCreateUserAccount(order.customer).then(() => {
                    this.checkOrderTriggers(order).then(() => {
                        resolve(order);
                    });
                });
            }).catch(e => {
                console.log("Order Notification persisting failed: " + e.stack);
                reject(e);
            });
        });
    }

    private startDoubleOptInForPurchase(mappedInput: MappedOrderInput, broker: Broker): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let actionDao: PendingActionDao = Container.get(PendingActionDao);
            let settingsDao: SystemSettingDao = Container.get(SystemSettingDao);
            let mailTemplateDao: MailTemplateDao = Container.get(MailTemplateDao);
            let action: PendingAction = actionDao.createConfirmOrderAction();
            let payload = {
                brokerUuid: broker.uuid,
                mappedInput: mappedInput
            };
            action.setPayload(payload);
            actionDao.save(action).then(action => {
                mailTemplateDao.getByType(MailTemplateType.ConfirmOrder).then(mailTemplate => {
                    settingsDao.getString(SystemSettingId.Site_Url, "").then(siteUrl => {
                        let params = {
                            broker: broker.name,
                            firstname: mappedInput.customer.firstname,
                            lastname: mappedInput.customer.lastname,
                            uuid: action.uuid,
                            siteUrl: siteUrl
                        };
                        let recipient: Address = {
                            email: mappedInput.customer.email
                        };
                        Email.sendByTemplate(mailTemplate, recipient, params);
                        resolve();
                    }).catch(e => reject(e));
                }).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }

    private checkCreateUserAccount(person: Person): Promise<Person> {
        return new Promise<Person>((resolve, reject) => {
            if (!person.roleCustomer || !person.password) {
                let personDao: PersonDao = Container.get(PersonDao);
                let mailTemplateDao: MailTemplateDao = Container.get(MailTemplateDao);
                let settingsDao: SystemSettingDao = Container.get(SystemSettingDao);
                let plainPassword: string = pwGen.generate({
                    length: 12,
                    numbers: true
                });
                person.setPlainPassword(plainPassword);
                person.roleCustomer = true;
                personDao.save(person).then(person => {
                    mailTemplateDao.getByType(MailTemplateType.NewAccount).then((template) => {
                        settingsDao.getString(SystemSettingId.Site_Url, "").then(siteUrl => {
                            let recipient: Address = {
                                name: person.firstname + " " + person.lastname,
                                email: person.email
                            };
                            let params = {
                                firstname: person.firstname,
                                lastname: person.lastname,
                                siteUrl: siteUrl,
                                password: plainPassword
                            };
                            Email.sendByTemplate(template, recipient, params).then(() => {
                                resolve(person);
                            }).catch(e => reject(e));
                        }).catch(e => reject(e));
                    }).catch(e => reject(e));
                }).catch(e => reject(e));
            } else {
                resolve(person);
            }
        });
    }

    private checkOrderTriggers(purchase: Purchase): Promise<void[]> {
        let process: Promise<void>[] = purchase.items.map((item) => {
            item.purchase = purchase;
            return this.checkOrderItemTriggers(item);
        });
        return Promise.all<void>(process);
    }

    private async checkOrderItemTriggers(item: PurchaseItem): Promise<void> {
        let siteUrl = await Container.get(SystemSettingDao).getString(SystemSettingId.Site_Url, "");
        return new Promise<void>((resolve, reject) => {
            let mailTemplateDao: MailTemplateDao = Container.get(MailTemplateDao);
            let productVariant: ProductVariant = item.productVariant;
            let type: ProductVariantType = productVariant.type;
            let customer: Person = item.purchase.customer;
            let recipient: Address = {
                name: customer.firstname + " " + customer.lastname,
                email: customer.email
            };
            if (type === ProductVariantType.Eval) {
                mailTemplateDao.getByType(MailTemplateType.DownloadEval).then((template) => {
                    let params = {
                        firstname: customer.firstname,
                        lastname: customer.lastname,
                        siteUrl: siteUrl,
                        product: item.productVariant.product.title
                    };
                    Email.sendByTemplate(template, recipient, params).then(() => {
                        resolve();
                    });
                });
            } else if (type === ProductVariantType.LifetimeLicense) {
                this.createLicenseKeyRequest(item).then(() => {
                    mailTemplateDao.getByType(MailTemplateType.PurchaseLicenseKey).then((template) => {
                        let params = {
                            firstname: customer.firstname,
                            lastname: customer.lastname,
                            siteUrl: siteUrl,
                            product: item.productVariant.product.title
                        };
                        Email.sendByTemplate(template, recipient, params).then(() => {
                            resolve();
                        });
                    });
                }).catch(() => reject());
            } else if (type === ProductVariantType.LimitedLicense) {
                this.createLicenseKeyRequest(item).then(() => {
                    mailTemplateDao.getByType(MailTemplateType.PurchaseLicenseKey).then((template) => {
                        let params = {
                            firstname: customer.firstname,
                            lastname: customer.lastname,
                            siteUrl: siteUrl,
                            product: item.productVariant.product.title
                        };
                        Email.sendByTemplate(template, recipient, params).then(() => {
                            resolve();
                        });
                    });
                }).catch(() => reject());
            } else if (type === ProductVariantType.TrialLicense) {
                this.createLicenseKeyRequest(item).then(() => {
                    mailTemplateDao.getByType(MailTemplateType.PurchaseLicenseKey).then((template) => {
                        let params = {
                            firstname: customer.firstname,
                            lastname: customer.lastname,
                            siteUrl: siteUrl,
                            product: item.productVariant.product.title
                        };
                        Email.sendByTemplate(template, recipient, params).then(() => {
                            resolve();
                        });
                    });
                }).catch(() => reject());
            } else if (type === ProductVariantType.SupportTicket) {
                this.createSupportRequest(item).then(() => {
                    mailTemplateDao.getByType(MailTemplateType.PurchaseSupportTicket).then((template) => {
                        let params = {
                            firstname: customer.firstname,
                            lastname: customer.lastname,
                            siteUrl: siteUrl,
                            product: item.productVariant.product.title
                        };
                        Email.sendByTemplate(template, recipient, params).then(() => {
                            resolve();
                        });
                    });
                }).catch(() => reject());
            }
            resolve();
        });
    }

    private createLicenseKeyRequest(item: PurchaseItem): Promise<LicenseKey[]> {
        let licenseKeyDao: LicenseKeyDao = Container.get(LicenseKeyDao);
        let promises: Promise<LicenseKey>[] = [];
        for (let i = 1; i <= item.quantity; i++) {
            let key: LicenseKey = new LicenseKey();
            key.purchaseItem = item;
            key.customer = item.purchase.customer;
            key.productVariant = item.productVariant;
            promises.push(licenseKeyDao.save(key));
        }
        return Promise.all(promises);
    }

    private createSupportRequest(item: PurchaseItem): Promise<SupportTicket[]> {
        let supportTicketDao: SupportTicketDao;
        let promises: Promise<SupportTicket>[] = [];
        for (let i = 1; i <= item.quantity; i++) {
            let ticket = new SupportTicket();
            ticket.purchaseItem = item;
            ticket.customer = item.purchase.customer;
            ticket.productVariant = item.productVariant;
            ticket.status = SupportRequestStatus.NEW;
            promises.push(supportTicketDao.save(ticket));
        }
        return Promise.all(promises);
    }
}

export default new OrderNotificationRouter().router;

import * as jsonMapper from 'json-mapper-json';
import * as xmlJs from 'xml-js';
import { Container } from "typedi";
import { Broker } from '../entity/Broker';
import { BrokerProductVariant } from "../entity/BrokerProductVariant";
import { Purchase } from '../entity/Purchase';
import { PurchaseItem } from '../entity/PurchaseItem';
import { PurchaseDao } from "../dao/PurchaseDao";
import { PurchaseItemDao } from "../dao/PurchaseItemDao";
import { BrokerProductVariantDao } from "../dao/BrokerProductVariantDao";
import { Person } from "../entity/Person";
import { PersonDao } from "../dao/PersonDao";

export class OrderNotificationMapper {
    public static map(input: string|Object, broker: Broker, persist?: boolean): Promise<Purchase> {
        return new Promise<Purchase>((resolve, reject) => {
            let convertedInput: Object = OrderNotificationMapper.getInputAsJson(input);
            let template = JSON.parse(broker.mappingTemplate);
            jsonMapper(convertedInput, template).then((result) => {
                let purchase: Purchase = new Purchase();
                purchase.broker = broker;
                purchase.referenceId = result.id;
                OrderNotificationMapper.getOrCreateCustomer(result.customer, persist).then((customer) => {
                    purchase.customer = customer;
                    OrderNotificationMapper.getOrderItems(broker, result.items, persist).then((items) => {
                        purchase.items = items;
                        if (persist) {
                            let purchaseDao = Container.get(PurchaseDao);
                            purchaseDao.save(purchase).then(order => resolve(order));
                        } else {
                            resolve(purchase);
                        }
                    }).catch((e) => reject(e));
                });
            }).catch((e) => reject(e));
        });
    }

    private static async getOrCreateCustomer(json: any, persist?: boolean): Promise<Person> {
        let customerDao: PersonDao = Container.get(PersonDao);
        let customer: Person = await customerDao.getByEmail(json.email);
        return new Promise<Person>((resolve, reject) => {
            if (customer === undefined || customer == null) {
                customer = new Person();
                customer.firstname = json.firstname;
                customer.lastname = json.lastname;
                customer.company = json.company;
                customer.email = json.email;
                customer.country = json.country;
                if (persist) {
                    customerDao.save(customer).then(customer => resolve(customer));
                } else {
                    resolve(customer);
                }
            } else {
                resolve(customer);
            }
        });
    }

    private static async getOrderItems(broker: Broker, jsonItems: Array<any>, persist?: boolean): Promise<PurchaseItem[]> {
        jsonItems = [].concat(jsonItems);
        let purchaseItemDao: PurchaseItemDao = Container.get(PurchaseItemDao);
        let brokerProductVariantDao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        let process: Promise<PurchaseItem>[] = jsonItems.map((json) => {
            return new Promise<PurchaseItem>((resolve, reject) => {
                brokerProductVariantDao.getByBrokerId(broker, json.id).then((brokerProductVariant) => {
                    if (brokerProductVariant === undefined || brokerProductVariant == null) {
                        reject(new Error("No such id for broker: " + json.id));
                        return;
                    }
                    let item: PurchaseItem = new PurchaseItem();
                    item.productVariant = brokerProductVariant.productVariant;
                    item.quantity = parseInt(json.quantity, 10);
                    if (persist) {
                        purchaseItemDao.save(item).then(item => resolve(item));
                    } else {
                        resolve(item);
                    }
                });
            });
        });
        return Promise.all<PurchaseItem>(process);
    }

    private static getInputAsJson(input: string|Object): Object {
        if (typeof input === "string") {
            if (input.trim().startsWith("<")) {
                return xmlJs.xml2js(input, {compact: true});
            } else {
                return JSON.parse(input);
            }
        } else {
            return input;
        }
    }
}

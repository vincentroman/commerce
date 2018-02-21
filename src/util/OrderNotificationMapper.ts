import * as xmlJs from 'xml-js';
import * as objectMapper from 'object-mapper';
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
    /**
     * Maps an incoming order notification (JSON/XML string or object) to the target JSON structure.
     * The incoming order notification is validated (i.e. checks if product names can be resolved).
     * No persistence or any other further processing is performed.
     *
     * @param input JSON/XML string or Object
     * @param broker The broker that sent the order notification input
     */
    public static mapAndValidate(input: string|Object, broker: Broker): Promise<MappedOrderInput> {
        return new Promise<any>((resolve, reject) => {
            let src: Object = OrderNotificationMapper.getInputAsJson(input);
            let map: any = JSON.parse(broker.mappingTemplate);
            let mappedInput: MappedOrderInput = objectMapper(src, map);
            OrderNotificationMapper.processMappedInput(mappedInput, broker, false).then(purchase => {
                resolve(mappedInput);
            }).catch(reason => reject(reason));
        });
    }

    /**
     * Resolves a previously mapped JSON structure (via mapAndValidate) to a Purchase object.
     * The resulting Purchase object and its linked objects (Person, OrderItem, etc.) get persisted
     * to the database, if the parameter persist is set to true.
     *
     * Customers (Person object) are created with no password set and no role set (helps to identify
     * newly created customers in contrast to existing ones).
     *
     * Customers are uniquely identified by their email address.
     *
     * @param input JSON/XML string or Object
     * @param broker The broker that sent the order notification input
     * @param persist true to persist resulting purchase to database
     */
    public static persistMappedOrder(mappedInput: MappedOrderInput, broker: Broker): Promise<Purchase> {
        return OrderNotificationMapper.processMappedInput(mappedInput, broker, true);
    }

    /**
     * Maps an incoming order notification (JSON/XML string or object) to a Purchase object.
     * The resulting Purchase object and its linked objects (Person, OrderItem, etc.) get persisted
     * to the database, if the parameter persist is set to true.
     *
     * Customers (Person object) are created with no password set and no role set (helps to identify
     * newly created customers in contrast to existing ones).
     *
     * Customers are uniquely identified by their email address.
     *
     * @param input JSON/XML string or Object
     * @param broker The broker that sent the order notification input
     * @param persist true to persist resulting purchase to database
     */
    public static map(input: string|Object, broker: Broker, persist?: boolean): Promise<Purchase> {
        return OrderNotificationMapper.mapAndValidate(input, broker).then(mappedInput => {
            return OrderNotificationMapper.processMappedInput(mappedInput, broker, persist);
        });
    }

    private static processMappedInput(mappedInput: MappedOrderInput, broker: Broker, persist?: boolean): Promise<Purchase> {
        return new Promise<Purchase>((resolve, reject) => {
            let purchase: Purchase = new Purchase();
            purchase.broker = broker;
            purchase.referenceId = mappedInput.id;
            OrderNotificationMapper.getOrCreateCustomer(mappedInput.customer, persist).then((customer) => {
                purchase.customer = customer;
                OrderNotificationMapper.getOrderItems(broker, mappedInput.items, persist).then((items) => {
                    purchase.items = items;
                    if (persist) {
                        let purchaseDao = Container.get(PurchaseDao);
                        purchaseDao.save(purchase).then(order => resolve(order));
                    } else {
                        resolve(purchase);
                    }
                }).catch((e) => reject(e));
            });
        });
    }

    private static async getOrCreateCustomer(json: MappedCustomer, persist?: boolean): Promise<Person> {
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

    private static async getOrderItems(broker: Broker, jsonItems: MappedItem[], persist?: boolean): Promise<PurchaseItem[]> {
        jsonItems = [].concat(jsonItems);
        let purchaseItemDao: PurchaseItemDao = Container.get(PurchaseItemDao);
        let brokerProductVariantDao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        let process: Promise<PurchaseItem>[] = jsonItems.map((json) => {
            return new Promise<PurchaseItem>((resolve, reject) => {
                brokerProductVariantDao.getByBrokerId(broker, json.id).then((brokerProductVariant) => {
                    if (brokerProductVariant === undefined || brokerProductVariant == null) {
                        reject(new Error("No such broker-product-variant for broker: " + json.id));
                        return;
                    }
                    let item: PurchaseItem = new PurchaseItem();
                    item.productVariant = brokerProductVariant.productVariant;
                    item.quantity = +json.quantity;
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

export type MappedOrderInput = {
    id: string;
    customer: MappedCustomer;
    items: MappedItem[];
};

export type MappedCustomer = {
    firstname: string;
    lastname: string;
    company: string;
    email: string;
    country: string;
};

export type MappedItem = {
    id: string;
    quantity: number;
};

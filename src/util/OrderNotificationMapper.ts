import * as jsonMapper from 'json-mapper-json';
import * as xmlJs from 'xml-js';
import { Container } from "typedi";
import { Broker } from '../entity/Broker';
import { BrokerProductVariant } from "../entity/BrokerProductVariant";
import { Customer } from '../entity/Customer';
import { Order } from '../entity/Order';
import { OrderItem } from '../entity/OrderItem';
import { CustomerDao } from "../dao/CustomerDao";
import { OrderItemDao } from "../dao/OrderItemDao";
import { BrokerProductVariantDao } from "../dao/BrokerProductVariantDao";

export class OrderNotificationMapper {
    public static map(input: string|Object, broker: Broker): Promise<Order> {
        return new Promise<Order>((resolve, reject) => {
            let convertedInput: Object = OrderNotificationMapper.getInputAsJson(input);
            let template = JSON.parse(broker.mappingTemplate);
            jsonMapper(convertedInput, template).then((result) => {
                let order: Order = new Order();
                order.referenceId = result.id;
                OrderNotificationMapper.getOrCreateCustomer(result.customer).then((customer) => {
                    order.customer = customer;
                    OrderNotificationMapper.getOrderItems(broker, result.items).then((items) => {
                        order.items = items;
                        resolve(order);
                    }).catch((e) => reject(e));
                });
            }).catch((e) => reject(e));
        });
    }

    private static async getOrCreateCustomer(json: any): Promise<Customer> {
        let customerDao: CustomerDao = Container.get(CustomerDao);
        let customer: Customer = await customerDao.getByEmail(json.email);
        return new Promise<Customer>((resolve, reject) => {
            if (customer === undefined || customer == null) {
                customer = new Customer();
                customer.firstname = json.firstname;
                customer.lastname = json.lastname;
                customer.company = json.company;
                customer.email = json.email;
                customer.country = json.country;
            }
            resolve(customer);
        });
    }

    private static async getOrderItems(broker: Broker, jsonItems: Array<any>): Promise<OrderItem[]> {
        jsonItems = [].concat(jsonItems);
        let orderItemDao: OrderItemDao = Container.get(OrderItemDao);
        let brokerProductVariantDao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        let process: Promise<OrderItem>[] = jsonItems.map((json) => {
            return new Promise<OrderItem>((resolve, reject) => {
                brokerProductVariantDao.getByBrokerId(broker, json.id).then((brokerProductVariant) => {
                    if (brokerProductVariant === undefined || brokerProductVariant == null) {
                        reject(new Error("No such id for broker: " + json.id));
                        return;
                    }
                    let item: OrderItem = new OrderItem();
                    item.productVariant = brokerProductVariant.productVariant;
                    item.quantity = parseInt(json.quantity);
                    resolve(item);
                });
            });
        });
        return Promise.all<OrderItem>(process);
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

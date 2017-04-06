import * as jsonMapper from 'json-mapper-json';
import * as xmlJs from 'xml-js';
import { Container } from "typedi";
import { Broker } from '../entity/Broker';
import { Customer } from '../entity/Customer';
import { Order } from '../entity/Order';
import { OrderItem } from '../entity/OrderItem';
import { CustomerDao } from "../dao/CustomerDao";

export class OrderNotificationMapper {
    public static map(input: string|Object, template: Object): Promise<Order> {
        return new Promise<Order>((resolve, reject) => {
            let convertedInput: Object = OrderNotificationMapper.getInputAsJson(input);
            //console.log("------> IN: " + JSON.stringify(convertedInput));
            jsonMapper(convertedInput, template).then((result) => {
                //console.log("---------> OUT: " + JSON.stringify(result));
                let order: Order = new Order();
                order.referenceId = result.id;
                OrderNotificationMapper.getOrCreateCustomer(result.customer).then((customer) => {
                    order.customer = customer;
                    resolve(order);
                });
            }).catch((e) => reject(e));
        });
    }

    private static async getOrCreateCustomer(json: any): Promise<Customer> {
        let customerDao: CustomerDao = Container.get(CustomerDao);
        let customer: Customer = await customerDao.getByEmail(json.email);
        return new Promise<Customer>((resolve, reject) => {
            if (customer == undefined || customer == null) {
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

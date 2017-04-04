import * as jsonMapper from 'json-mapper-json';
import * as xmlJs from 'xml-js';
import { Broker } from '../entity/Broker';
import { Customer } from '../entity/Customer';
import { Order } from '../entity/Order';
import { OrderItem } from '../entity/OrderItem';

export class OrderNotificationMapper {
    public static map(input: string|Object, template: Object): Promise<Order> {
        return new Promise<Order>((resolve, reject) => {
            let convertedInput: Object = OrderNotificationMapper.getInputAsJson(input);
            console.log("------> IN: " + JSON.stringify(convertedInput));
            jsonMapper(convertedInput, template).then((result) => {
                console.log("---------> OUT: " + JSON.stringify(result));
                let order: Order = new Order();
                order.referenceId = result.id;
                order.customer = new Customer();

                // TODO
                resolve(order);
            }).catch((e) => reject(e));
        });
    }

    private static getInputAsJson(input: string|Object): Object {
        if (typeof input === "string") {
            console.log("STRING!!!!!!!!!!!!!!!!!!!!");
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

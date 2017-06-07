import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";
import { Broker } from "./broker";
import { Customer } from "./customer";

export class Purchase extends RestModel implements Serializable<Purchase> {
    customer: Customer;
    broker: Broker;
    itemsIds: string[];
    referenceId: string;

    serialize(): Object {
        return {
            // Not supported
        };
    }

    deserialize(input: any): Purchase {
        this.uuid = input.uuid;
        this.customer = (input.customer ? new Customer().deserialize(input.customer) : null);
        this.broker = (input.broker ? new Broker().deserialize(input.broker) : null);
        this.itemsIds = (input.itemsIds ? input.itemsIds : []);
        this.referenceId = input.referenceId;
        return this;
    }
}

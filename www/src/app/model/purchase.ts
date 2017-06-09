import { RestModel } from "./rest-model";
import { Broker } from "./broker";
import { Customer } from "./customer";

export class Purchase extends RestModel<Purchase> {
    customer: Customer;
    broker: Broker;
    itemsIds: string[];
    referenceId: string;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            // Not supported
        });
    }

    deserialize(input: any): Purchase {
        this._deserialize(input);
        this.customer = (input.customer ? new Customer().deserialize(input.customer) : null);
        this.broker = (input.broker ? new Broker().deserialize(input.broker) : null);
        this.itemsIds = (input.itemsIds ? input.itemsIds : []);
        this.referenceId = input.referenceId;
        return this;
    }
}

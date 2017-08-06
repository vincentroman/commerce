import { RestModel } from "./rest-model";
import { Broker } from "./broker";
import { Person } from "./person";

export class Purchase extends RestModel<Purchase> {
    customer: Person;
    broker: Broker;
    itemIds: string[];
    referenceId: string;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            // Not supported
        });
    }

    deserialize(input: any): Purchase {
        this._deserialize(input);
        this.customer = (input.customer ? new Person().deserialize(input.customer) : null);
        this.broker = (input.broker ? new Broker().deserialize(input.broker) : null);
        this.itemIds = (input.itemIds ? input.itemIds : []);
        this.referenceId = input.referenceId;
        return this;
    }
}

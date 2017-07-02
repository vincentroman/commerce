import { RestModel } from "./rest-model";
import { Broker } from "./broker";
import { ProductVariant } from "./product-variant";

export class BrokerProductVariant extends RestModel<BrokerProductVariant> {
    broker: Broker;
    productVariant: ProductVariant;
    idForBroker: string;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            "broker": this.broker.serialize(),
            "productVariant": this.productVariant.serialize(),
            "idForBroker": this.idForBroker
        });
    }

    deserialize(input: any): BrokerProductVariant {
        this._deserialize(input);
        this.broker = new Broker().deserialize(input.broker);
        this.productVariant = new ProductVariant().deserialize(input.productVariant);
        this.idForBroker = input.idForBroker;
        return this;
    }
}
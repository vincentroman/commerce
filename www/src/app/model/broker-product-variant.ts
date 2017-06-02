import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";
import { Broker } from "./broker";
import { ProductVariant } from "./product-variant";

export class BrokerProductVariant extends RestModel implements Serializable<BrokerProductVariant> {
    broker: Broker;
    productVariant: ProductVariant;
    idForBroker: string;

    serialize(): Object {
        return {
            "uuid": this.uuid,
            "broker": this.broker.serialize(),
            "productVariant": this.productVariant.serialize(),
            "idForBroker": this.idForBroker
        };
    }

    deserialize(input: any): BrokerProductVariant {
        this.uuid = input.uuid;
        this.broker = new Broker().deserialize(input.broker);
        this.productVariant = new ProductVariant().deserialize(input.productVariant);
        this.idForBroker = input.idForBroker;
        return this;
    }
}

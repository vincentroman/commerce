import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Broker } from "./Broker";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class BrokerProductVariant extends DbEntity<BrokerProductVariant> {
    @ManyToOne(type => Broker)
    broker: Broker;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @Column()
    idForBroker: string;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            broker: this.broker.serialize(),
            productVariant: this.productVariant.serialize(),
            idForBroker: this.idForBroker
        });
    }

    public deserialize(o: Object): BrokerProductVariant {
        this.broker = (o['broker'] ? new Broker().deserialize(o['broker']) : null);
        this.productVariant = (o['productVariant'] ? new ProductVariant().deserialize(o['productVariant']) : null);
        this.idForBroker = o['idForBroker'];
        return this;
    }
}

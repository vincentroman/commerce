import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Broker } from "./Broker";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class BrokerProductVariant extends DbEntity {
    @ManyToOne(type => Broker)
    broker: Broker;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @Column()
    idForBroker: string;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            // TODO
        });
    }

    public deserialize(o: Object): void {
        // TODO
    }
}

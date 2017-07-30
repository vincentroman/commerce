import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Broker } from "./Broker";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class BrokerProductVariant extends DbEntity<BrokerProductVariant> {
    @ManyToOne(type => Broker, {nullable: false})
    broker: Broker;

    @ManyToOne(type => ProductVariant, {nullable: false})
    productVariant: ProductVariant;

    @Column()
    idForBroker: string;

    @Column({nullable: true})
    url: string;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            broker: this.broker.serialize(),
            productVariant: this.productVariant.serialize(),
            idForBroker: this.idForBroker,
            url: this.url
        });
    }

    public deserialize(o: Object): BrokerProductVariant {
        this.broker = (o['broker'] ? new Broker().deserialize(o['broker']) : null);
        this.productVariant = (o['productVariant'] ? new ProductVariant().deserialize(o['productVariant']) : null);
        this.idForBroker = o['idForBroker'];
        this.url = o['url'];
        return this;
    }

    public isConsistent(): boolean {
        if (this.broker &&
            this.productVariant) {
            return true;
        }
        return false;
    }
}

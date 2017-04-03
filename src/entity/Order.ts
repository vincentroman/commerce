import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Customer } from "./Customer";
import { Broker } from "./Broker";

@Entity()
export class Order extends DbEntity {
    @ManyToOne(type => Customer)
    customer: Customer;

    @ManyToOne(type => Broker)
    broker: Broker;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
        });
    }

    public  deserialize(o: Object): void {
        // TODO
    }
}

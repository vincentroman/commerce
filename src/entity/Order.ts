import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Customer } from "./Customer";
import { Broker } from "./Broker";
import { OrderItem } from "./OrderItem";

@Entity()
export class Order extends DbEntity {
    @ManyToOne(type => Customer)
    customer: Customer;

    @ManyToOne(type => Broker)
    broker: Broker;

    @OneToMany(type => OrderItem, orderItem => orderItem.order)
    items: OrderItem[];

    @Column()
    referenceId: string;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            // TODO
        });
    }

    public  deserialize(o: Object): void {
        // TODO
    }
}

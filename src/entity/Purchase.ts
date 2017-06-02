import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Customer } from "./Customer";
import { Broker } from "./Broker";
import { PurchaseItem } from "./PurchaseItem";

@Entity()
export class Purchase extends DbEntity<Purchase> {
    @ManyToOne(type => Customer)
    customer: Customer;

    @ManyToOne(type => Broker)
    broker: Broker;

    @OneToMany(type => PurchaseItem, purchaseItem => purchaseItem.purchase)
    items: PurchaseItem[];

    @Column()
    referenceId: string;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            // TODO
        });
    }

    public  deserialize(o: Object): Purchase {
        // TODO
        return this;
    }
}

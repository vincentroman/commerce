import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Broker } from "./Broker";
import { PurchaseItem } from "./PurchaseItem";
import { Person } from "./Person";

@Entity()
export class Purchase extends DbEntity<Purchase> {
    @ManyToOne(type => Person)
    customer: Person;

    @ManyToOne(type => Broker, {nullable: true})
    broker: Broker;

    @OneToMany(type => PurchaseItem, purchaseItem => purchaseItem.purchase)
    items: PurchaseItem[];

    @Column({nullable: true})
    referenceId: string;

    public serialize(skipDeletedCheck?: boolean): Object {
        return Object.assign(super.serialize(skipDeletedCheck), {
            customer: (this.customer ? this.customer.serialize(true) : null),
            broker: (this.broker ? this.broker.serialize(true) : null),
            itemIds: (this.items ? this.items.map(item => item.uuid) : []),
            referenceId: this.referenceId
        });
    }

    public  deserialize(o: Object): Purchase {
        // Deserializing not supported
        return this;
    }

    public isConsistent(): boolean {
        if (this.customer) {
            return true;
        }
        return false;
    }
}

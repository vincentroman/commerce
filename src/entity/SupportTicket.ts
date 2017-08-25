import * as moment from 'moment';
import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { ProductVariant } from "./ProductVariant";
import { PurchaseItem } from "./PurchaseItem";
import { Person } from "./Person";

@Entity()
export class SupportTicket extends DbEntity<SupportTicket> {
    @Column("text", {nullable: true})
    text: string;

    @Column("datetime", {nullable: true})
    sendDate: Date;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @ManyToOne(type => Person)
    customer: Person;

    @ManyToOne(type => PurchaseItem, {nullable: true})
    purchaseItem: PurchaseItem;

    @Column()
    status: SupportRequestStatus;

    public serialize(skipDeletedCheck?: boolean): Object {
        return Object.assign(super.serialize(skipDeletedCheck), {
            text: this.text,
            sendDate: (this.sendDate ? moment(this.sendDate).format("YYYY-MM-DD HH:mm:ss") : null),
            productVariant: (this.productVariant ? this.productVariant.serialize(true) : null),
            customer: (this.customer ? this.customer.serialize(true) : null),
            purchaseItem: (this.purchaseItem ? this.purchaseItem.serialize(true) : null),
            status: this.status
        });
    }

    public deserialize(o: Object): SupportTicket {
        // Deserializing not supported
        return this;
    }

    public isConsistent(): boolean {
        if (this.productVariant &&
            this.customer &&
            this.status) {
            return true;
        }
        return false;
    }
}

export enum SupportRequestStatus {
    NEW = 1,
    OPEN = 2,
    CLOSED = 3
}

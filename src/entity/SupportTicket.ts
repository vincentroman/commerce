import * as moment from 'moment';
import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { ProductVariant } from "./ProductVariant";
import { Customer } from "./Customer";
import { PurchaseItem } from "./PurchaseItem";

@Entity()
export class SupportTicket extends DbEntity<SupportTicket> {
    @Column("text", {nullable: true})
    text: string;

    @Column("datetime", {nullable: true})
    sendDate: Date;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @ManyToOne(type => Customer)
    customer: Customer;

    @ManyToOne(type => PurchaseItem, {nullable: true})
    purchaseItem: PurchaseItem;

    @Column()
    status: SupportRequestStatus;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            text: this.text,
            sendDate: (this.sendDate ? moment(this.sendDate).format("YYYY-MM-DD HH:mm:ss") : null),
            productVariant: (this.productVariant ? this.productVariant.serialize() : null),
            customer: (this.customer ? this.customer.serialize() : null),
            purchaseItem: (this.purchaseItem ? this.purchaseItem.serialize() : null),
            status: this.status
        });
    }

    public deserialize(o: Object): SupportTicket {
        // Deserializing not supported
        return this;
    }
}

export enum SupportRequestStatus {
    NEW = 1,
    OPEN = 2,
    CLOSED = 3
}

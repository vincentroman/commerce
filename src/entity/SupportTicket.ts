import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { ProductVariant } from "./ProductVariant";
import { Customer } from "./Customer";
import { PurchaseItem } from "./PurchaseItem";

@Entity()
export class SupportTicket extends DbEntity {
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
            // TODO
        });
    }

    public deserialize(o: Object): void {
        // TODO
    }
}

export enum SupportRequestStatus {
    NEW = 1,
    OPEN = 2,
    CLOSED = 3
}

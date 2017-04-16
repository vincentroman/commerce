import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { ProductVariant } from "./ProductVariant";
import { Customer } from "./Customer";
import { PurchaseItem } from "./PurchaseItem";

@Entity()
export class LicenseKey extends DbEntity {
    @Column("text", {nullable: true})
    licenseKey: string;

    @Column("datetime", {nullable: true})
    issueDate: Date;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @ManyToOne(type => Customer)
    customer: Customer;

    @ManyToOne(type => PurchaseItem, {nullable: true})
    purchaseItem: PurchaseItem;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            // TODO
        });
    }

    public deserialize(o: Object): void {
        // TODO
    }
}

import * as moment from 'moment';
import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { ProductVariant } from "./ProductVariant";
import { Customer } from "./Customer";
import { PurchaseItem } from "./PurchaseItem";

@Entity()
export class LicenseKey extends DbEntity<LicenseKey> {
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
            licenseKey: this.licenseKey,
            issueDate: moment(this.createDate).format("YYYY-MM-DD HH:mm:ss"),
            productVariant: (this.productVariant ? this.productVariant.serialize() : null),
            customer: (this.customer ? this.customer.serialize() : null),
            purchaseItem: (this.purchaseItem ? this.purchaseItem.serialize() : null)
        });
    }

    public deserialize(o: Object): LicenseKey {
        // Deserializing not supported
        return this;
    }
}

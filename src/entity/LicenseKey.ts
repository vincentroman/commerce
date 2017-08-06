import * as moment from 'moment';
import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { ProductVariant } from "./ProductVariant";
import { PurchaseItem } from "./PurchaseItem";
import { Person } from "./Person";

@Entity()
export class LicenseKey extends DbEntity<LicenseKey> {
    @Column("text", {nullable: true})
    licenseKey: string;

    @Column("datetime", {nullable: true})
    issueDate: Date;

    @Column("datetime", {nullable: true})
    expiryDate: Date;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @ManyToOne(type => Person)
    customer: Person;

    @ManyToOne(type => PurchaseItem, {nullable: true})
    purchaseItem: PurchaseItem;

    public getDaysUntilExpiry(): number {
        if (this.expiryDate) {
            let expiryDate: moment.Moment = moment(this.expiryDate);
            let days = Number(expiryDate.diff(moment(), "days"));
            return days;
        } else {
            return null;
        }
    }

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            licenseKey: this.licenseKey,
            issueDate: (this.issueDate ? moment(this.issueDate).format("YYYY-MM-DD HH:mm:ss") : null),
            expiryDate: (this.expiryDate ? moment(this.expiryDate).format("YYYY-MM-DD HH:mm:ss") : null),
            productVariant: (this.productVariant ? this.productVariant.serialize() : null),
            customer: (this.customer ? this.customer.serialize() : null),
            purchaseItem: (this.purchaseItem ? this.purchaseItem.serialize() : null),
            expiresInDays: this.getDaysUntilExpiry()
        });
    }

    public deserialize(o: Object): LicenseKey {
        // Deserializing not supported
        return this;
    }

    public isConsistent(): boolean {
        if (this.productVariant &&
            this.customer) {
            return true;
        }
        return false;
    }
}

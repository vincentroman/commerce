import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Purchase } from "./Purchase";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class PurchaseItem extends DbEntity<PurchaseItem> {
    @ManyToOne(type => Purchase)
    purchase: Purchase;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @Column()
    quantity: number;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            purchase: (this.purchase ? this.purchase.serialize() : null),
            productVariant: (this.productVariant ? this.productVariant.serialize() : null),
            quantity: this.quantity
        });
    }

    public  deserialize(o: Object): PurchaseItem {
        // Deserializing not supported
        return this;
    }
}

import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Purchase } from "./Purchase";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class PurchaseItem extends DbEntity {
    @ManyToOne(type => Purchase)
    purchase: Purchase;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @Column()
    quantity: number;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
        });
    }

    public  deserialize(o: Object): void {
        // TODO
    }
}

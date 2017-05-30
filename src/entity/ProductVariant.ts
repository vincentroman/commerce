import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Product } from "./Product";

@Entity()
export class ProductVariant extends DbEntity {
    @ManyToOne(type => Product, product => product.variants)
    product: Product;

    @Column()
    type: ProductVariantType;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            type: this.type
        });
    }

    public  deserialize(o: Object): void {
        this.type = o['type'];
    }
}

export enum ProductVariantType {
    TrialLicense = 1,
    LimitedLicense = 2,
    LifetimeLicense = 3,
    Eval = 4,
    SupportTicket = 5
}

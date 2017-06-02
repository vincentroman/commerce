import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Product } from "./Product";

@Entity()
export class ProductVariant extends DbEntity<ProductVariant> {
    @Column()
    title: string;

    @ManyToOne(type => Product, product => product.variants, {nullable: false})
    product: Product;

    @Column()
    type: ProductVariantType;

    @Column("int")
    numDomains: number;

    @Column("int")
    numSupportYears: number;

    @Column("double")
    price: number;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            title: this.title,
            type: this.type,
            numDomains: this.numDomains,
            numSupportYears: this.numSupportYears,
            price: this.price
        });
    }

    public deserialize(o: Object): ProductVariant {
        this.title = o['title'];
        this.type = o['type'];
        this.numDomains = o['numDomains'];
        this.numSupportYears = o['numSupportYears'];
        this.price = o['price'];
        if (this.product) {
            this.product.deserialize(o['product']);
        }
        return this;
    }
}

export enum ProductVariantType {
    TrialLicense = 1,
    LimitedLicense = 2,
    LifetimeLicense = 3,
    Eval = 4,
    SupportTicket = 5
}

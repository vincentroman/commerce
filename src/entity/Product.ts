import { Entity, Column, OneToMany } from "typeorm";
import { DbEntity } from "./DbEntity";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class Product extends DbEntity<Product> {
    @Column()
    title: string;

    @Column()
    licenseKeyIdentifier: string;

    @OneToMany(type => ProductVariant, variant => variant.product)
    variants: ProductVariant[];

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            title: this.title,
            licenseKeyIdentifier: this.licenseKeyIdentifier
        });
    }

    public deserialize(o: Object): Product {
        this.title = o['title'];
        this.licenseKeyIdentifier = o['licenseKeyIdentifier'];
        return this;
    }
}

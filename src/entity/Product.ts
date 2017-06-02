import { Entity, Column, OneToMany } from "typeorm";
import { DbEntity } from "./DbEntity";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class Product extends DbEntity<Product> {
    @Column()
    title: string;

    @OneToMany(type => ProductVariant, variant => variant.product)
    variants: ProductVariant[];

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            title: this.title
        });
    }

    public deserialize(o: Object): Product {
        this.title = o['title'];
        return this;
    }
}

import { Entity, Column, OneToMany } from "typeorm";
import { DbEntity } from "./DbEntity";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class Product extends DbEntity {
    @Column()
    title: string;

    @OneToMany(type => ProductVariant, variant => variant.product)
    variants: ProductVariant[];
}

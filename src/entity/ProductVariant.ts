import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Product } from "./Product";

@Entity()
export class ProductVariant extends DbEntity {
    @ManyToOne(type => Product, product => product.variants)
    product: Product;
}

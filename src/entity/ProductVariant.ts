import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Product } from "./Product";

@Entity()
export class ProductVariant extends DbEntity {
    @ManyToOne(type => Product, product => product.variants)
    product: Product;

    public serialize(): Object {
        return {
            uuid: this.uuid
        };
    }

    protected deserialize(o: Object): void {
        this.uuid = o['uuid'];
    }
}

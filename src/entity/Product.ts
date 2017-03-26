import { Entity, Column, OneToMany } from "typeorm";
import { DbEntity } from "./DbEntity";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class Product extends DbEntity {
    @Column()
    title: string;

    @OneToMany(type => ProductVariant, variant => variant.product)
    variants: ProductVariant[];

    public serialize(): Object {
        return {
            uuid: this.uuid,
            title: this.title
        };
    }

    protected deserialize(o: Object): void {
        this.uuid = o['uuid'];
        this.title = o['title'];
    }
}

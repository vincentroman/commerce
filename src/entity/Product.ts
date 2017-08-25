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

    public serialize(skipDeletedCheck?: boolean): Object {
        return Object.assign(super.serialize(skipDeletedCheck), {
            title: this.title,
            licenseKeyIdentifier: this.licenseKeyIdentifier
        });
    }

    public deserialize(o: Object): Product {
        this.title = o['title'];
        this.licenseKeyIdentifier = o['licenseKeyIdentifier'];
        return this;
    }

    public isConsistent(): boolean {
        if (this.title) {
            return true;
        }
        return false;
    }
}

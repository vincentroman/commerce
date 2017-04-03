import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Order } from "./Order";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class OrderItem extends DbEntity {
    @ManyToOne(type => Order)
    order: Order;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @Column()
    referenceId: string;

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

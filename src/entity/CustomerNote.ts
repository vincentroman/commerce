import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Customer } from "./Customer";

@Entity()
export class CustomerNote extends DbEntity {
    @ManyToOne(type => Customer)
    customer: Customer;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
        });
    }

    public  deserialize(o: Object): void {
        // TODO
    }
}

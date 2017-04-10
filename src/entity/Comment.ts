import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Customer } from "./Customer";
import { SupportRequest } from "./SupportRequest";

@Entity()
export class Comment extends DbEntity {
    @ManyToOne(type => Customer, {nullable: true})
    customer: Customer;

    @ManyToOne(type => SupportRequest, {nullable: true})
    supportRequest: SupportRequest;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
        });
    }

    public  deserialize(o: Object): void {
        // TODO
    }
}

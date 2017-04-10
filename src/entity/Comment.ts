import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Customer } from "./Customer";
import { SupportTicket } from "./SupportTicket";

@Entity()
export class Comment extends DbEntity {
    @ManyToOne(type => Customer, {nullable: true})
    customer: Customer;

    @ManyToOne(type => SupportTicket, {nullable: true})
    supportTicket: SupportTicket;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
        });
    }

    public  deserialize(o: Object): void {
        // TODO
    }
}

import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Customer } from "./Customer";
import { SupportTicket } from "./SupportTicket";
import { User } from "./User";

@Entity()
export class Comment extends DbEntity<Comment> {
    @Column("text", {nullable: false})
    text: string;

    @ManyToOne(type => Customer, {nullable: true})
    customer: Customer;

    @ManyToOne(type => SupportTicket, {nullable: true})
    supportTicket: SupportTicket;

    @ManyToOne(type => User, {nullable: false})
    author: User;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            text: this.text,
            customerUuid: (this.customer ? this.customer.uuid : null),
            supportTicketUuid: (this.supportTicket ? this.supportTicket.uuid : null),
            customer: (this.customer ? this.customer.serialize() : null)
        });
    }

    public  deserialize(o: Object): Comment {
        // Deserializing not supported
        return this;
    }
}

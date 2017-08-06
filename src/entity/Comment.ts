import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { SupportTicket } from "./SupportTicket";
import { Person } from "./Person";

@Entity()
export class Comment extends DbEntity<Comment> {
    @Column("text", {nullable: false})
    text: string;

    @ManyToOne(type => Person, {nullable: true})
    customer: Person;

    @ManyToOne(type => SupportTicket, {nullable: true})
    supportTicket: SupportTicket;

    @ManyToOne(type => Person, {nullable: false})
    author: Person;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            text: this.text,
            customerUuid: (this.customer ? this.customer.uuid : null),
            supportTicketUuid: (this.supportTicket ? this.supportTicket.uuid : null),
            author: (this.author ? this.author.serialize() : null)
        });
    }

    public  deserialize(o: Object): Comment {
        // Deserializing not supported
        return this;
    }

    public isConsistent(): boolean {
        if (this.text &&
            this.author &&
            (this.customer || this.supportTicket)) {
            return true;
        }
        return false;
    }
}

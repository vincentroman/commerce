import { Entity, Column } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class Customer extends DbEntity<Customer> {
    @Column({nullable: true})
    company: string;

    @Column({nullable: true})
    firstname: string;

    @Column({nullable: true})
    lastname: string;

    @Column()
    email: string;

    @Column({nullable: true})
    country: string;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            company:    this.company,
            firstname:  this.firstname,
            lastname:   this.lastname,
            email:      this.email,
            country:    this.country
        });
    }

    public deserialize(o: Object): Customer {
        this.company        = o['company'];
        this.firstname      = o['firstname'];
        this.lastname       = o['lastname'];
        this.email          = o['email'];
        this.country        = o['country'];
        return this;
    }

    public printableName(): string {
        let tokens = [];
        if (this.firstname) {
            tokens.push(this.firstname);
        }
        if (this.lastname) {
            tokens.push(this.lastname);
        }
        if (this.company) {
            tokens.push("(" + this.company + ")");
        }
        return tokens.join(" ");
    }

    public isConsistent(): boolean {
        if (this.email) {
            return true;
        }
        return false;
    }
}

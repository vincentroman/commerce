import { Entity, Column } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class Customer extends DbEntity {
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

    public deserialize(o: Object): void {
        this.company        = o['company'];
        this.firstname      = o['firstname'];
        this.lastname       = o['lastname'];
        this.email          = o['email'];
        this.country        = o['country'];
    }
}

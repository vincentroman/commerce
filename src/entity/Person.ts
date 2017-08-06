import * as bcrypt  from "bcrypt";
import { Entity, Column } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class Person extends DbEntity<Person> {
    @Column({nullable: true})
    company: string;

    @Column({nullable: true})
    firstname: string;

    @Column({nullable: true})
    lastname: string;

    @Column({nullable: true})
    country: string;

    @Column({unique: true, nullable: false})
    email: string;

    @Column({nullable: true})
    password: string;

    @Column()
    roleAdmin: boolean = false;

    @Column()
    roleCustomer: boolean = false;

    public setPlainPassword(password: string): void {
        let hash: string = bcrypt.hashSync(password, 10);
        this.password = hash;
    }

    public isPasswordValid(password: string): boolean {
        if (this.password == null || this.password === undefined || this.password.trim() === "") {
            return false;
        }
        return bcrypt.compareSync(password, this.password);
    }

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            company:    this.company,
            firstname:  this.firstname,
            lastname:   this.lastname,
            country:    this.country,
            email:      this.email,
            roleAdmin:  this.roleAdmin,
            roleCustomer:   this.roleCustomer
        });
    }

    public deserialize(o: Object): Person {
        this.company        = o['company'];
        this.firstname      = o['firstname'];
        this.lastname       = o['lastname'];
        this.email          = o['email'];
        this.country        = o['country'];
        this.roleAdmin      = (o['roleAdmin'] === 1 || o['roleAdmin'] === "true" || o['roleAdmin'] === true ? true : false);
        this.roleCustomer   = (o['roleCustomer'] === 1 || o['roleCustomer'] === "true" || o['roleCustomer'] === true ? true : false);
        if (o['password']) {
            this.setPlainPassword(o['password']);
        }
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

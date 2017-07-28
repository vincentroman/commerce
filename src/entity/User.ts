import * as bcrypt  from "bcrypt";
import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Customer } from "./Customer";

@Entity()
export class User extends DbEntity<User> {
    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    roleAdmin: boolean = false;

    @Column()
    roleCustomer: boolean = false;

    @OneToOne(type => Customer)
    @JoinColumn()
    customer: Customer;

    public setPlainPassword(password: string): void {
        let hash: string = bcrypt.hashSync(password, 10);
        this.password = hash;
    }

    public isPasswordValid(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            email: this.email,
            roleAdmin: this.roleAdmin,
            roleCustomer: this.roleCustomer,
            customer: (this.customer ? this.customer.serialize() : null)
        });
    }

    public deserialize(o: Object): User {
        this.email = o['email'];
        this.roleAdmin = (o['roleAdmin'] === 1 || o['roleAdmin'] === "true" || o['roleAdmin'] === true ? true : false);
        this.roleCustomer = (o['roleCustomer'] === 1 || o['roleCustomer'] === "true" || o['roleCustomer'] === true ? true : false);
        if (o['customer']) {
            this.customer = new Customer();
            this.customer.uuid = o['customer']['uuid'];
            this.customer = this.customer.deserialize(o['customer']);
        } else {
            this.customer = null;
        }
        if (o['password']) {
            this.setPlainPassword(o['password']);
        }
        return this;
    }

    public isConsistent(): boolean {
        if (this.email &&
            this.password) {
            return true;
        }
        return false;
    }
}

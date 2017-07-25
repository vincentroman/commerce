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
            roleCustomer: this.roleCustomer
        });
    }

    public deserialize(o: Object): User {
        this.email = o['email'];
        this.roleAdmin = (o['roleAdmin'] === 1 || o['roleAdmin'] === "true" ? true : false);
        this.roleCustomer = (o['roleCustomer'] === 1 || o['roleCustomer'] === "true" ? true : false);
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

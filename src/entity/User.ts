import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { DbEntity } from "./DbEntity";
import * as hashy  from 'hashy';
import { Customer } from "./Customer";

@Entity()
export class User extends DbEntity {
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

    public async setPlainPassword(password: string): Promise<void> {
        let hash: string = await hashy.hash(password, 'bcrypt');
        this.password = hash;
    }

    public isPasswordValid(password: string): Promise<boolean> {
        return hashy.verify(password, this.password, 'bcrypt');
    }

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            uuid: this.uuid,
            email: this.email,
            roleAdmin: this.roleAdmin,
            roleCustomer: this.roleCustomer
        });
    }

    public deserialize(o: Object): void {
        this.email = o['email'];
        this.roleAdmin = (o['roleAdmin'] === 1 || o['roleAdmin'] === "true" ? true : false);
        this.roleCustomer = (o['roleCustomer'] === 1 || o['roleCustomer'] === "true" ? true : false);
    }
}

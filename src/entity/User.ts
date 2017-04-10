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
            email: this.email,
            password: this.password
        });
    }

    public deserialize(o: Object): void {
        this.email = o['email'];
        this.password = o['password'];
    }
}

import * as bcrypt  from "bcrypt";
import * as moment from "moment";
import { Entity, Column } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class Person extends DbEntity<Person> {
    @Column({nullable: true, default: ""})
    company: string;

    @Column({nullable: true, default: ""})
    firstname: string;

    @Column({nullable: true, default: ""})
    lastname: string;

    @Column({nullable: true, default: ""})
    country: string;

    @Column({unique: true, nullable: false})
    email: string;

    @Column({nullable: true})
    password: string;

    @Column({default: true})
    receiveProductUpdates: boolean;

    @Column({default: false})
    roleAdmin: boolean;

    @Column({default: false})
    roleCustomer: boolean;

    @Column({nullable: true})
    lastDataVerification: Date;

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

    public serialize(skipDeletedCheck?: boolean): Object {
        return Object.assign(super.serialize(skipDeletedCheck), {
            company:                this.company,
            firstname:              this.firstname,
            lastname:               this.lastname,
            country:                this.country,
            email:                  this.email,
            receiveProductUpdates:  this.receiveProductUpdates,
            roleAdmin:              this.roleAdmin,
            roleCustomer:           this.roleCustomer,
            lastDataVerification:   this.lastDataVerification ? moment(this.lastDataVerification).format("YYYY-MM-DD HH:mm:ss") : null,
            needDataVerification:   this.needDataVerification()
        });
    }

    public deserialize(o: Object): Person {
        this.company        = o['company'];
        this.firstname      = o['firstname'];
        this.lastname       = o['lastname'];
        this.email          = o['email'];
        this.country        = o['country'];
        this.receiveProductUpdates =
            (o['receiveProductUpdates'] === 1 || o['receiveProductUpdates'] === "true" || o['receiveProductUpdates'] === true
            ? true : false);
        this.roleAdmin      = (o['roleAdmin'] === 1 || o['roleAdmin'] === "true" || o['roleAdmin'] === true ? true : false);
        this.roleCustomer   = (o['roleCustomer'] === 1 || o['roleCustomer'] === "true" || o['roleCustomer'] === true ? true : false);
        if (o['password']) {
            this.setPlainPassword(o['password']);
        }
        return this;
    }

    public needDataVerification(): boolean {
        return this.lastDataVerification === undefined ||
            this.lastDataVerification == null ||
            moment(this.lastDataVerification).isBefore(moment().subtract(1, "year"));
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

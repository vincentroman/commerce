import { RestModel } from "./rest-model";

export class Person extends RestModel<Person> {
    company: string;
    firstname: string;
    lastname: string;
    email: string;
    country: string;
    password: string;
    receiveProductUpdates: boolean = false;
    roleAdmin: boolean = false;
    roleCustomer: boolean = false;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            "company": this.company,
            "firstname": this.firstname,
            "lastname": this.lastname,
            "email": this.email,
            "country": this.country,
            "password": this.password,
            "receiveProductUpdates": this.receiveProductUpdates,
            "roleAdmin": this.roleAdmin,
            "roleCustomer": this.roleCustomer
        });
    }

    deserialize(input: any): Person {
        this._deserialize(input);
        this.firstname = input.firstname;
        this.lastname = input.lastname;
        this.email = input.email;
        this.company = input.company;
        this.country = input.country;
        this.password = "";
        this.receiveProductUpdates = input.receiveProductUpdates;
        this.roleAdmin = input.roleAdmin;
        this.roleCustomer = input.roleCustomer;
        return this;
    }

    printableName(): string {
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
}

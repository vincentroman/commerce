import { RestModel } from "./rest-model";

export class Customer extends RestModel<Customer> {
    company: string;
    firstname: string;
    lastname: string;
    email: string;
    country: string;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            "company": this.company,
            "firstname": this.firstname,
            "lastname": this.lastname,
            "email": this.email,
            "country": this.country,
        });
    }

    deserialize(input: any): Customer {
        this._deserialize(input);
        this.firstname = input.firstname;
        this.lastname = input.lastname;
        this.email = input.email;
        this.company = input.company;
        this.country = input.country;
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

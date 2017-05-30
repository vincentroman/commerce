import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";

export class Customer extends RestModel implements Serializable<Customer> {
    company: string;
    firstname: string;
    lastname: string;
    email: string;
    country: string;

    serialize(): Object {
        return {
            "uuid": this.uuid,
            "company": this.company,
            "firstname": this.firstname,
            "lastname": this.lastname,
            "email": this.email,
            "country": this.country,
        };
    }

    deserialize(input: any): Customer {
        this.uuid = input.uuid;
        this.firstname = input.firstname;
        this.lastname = input.lastname;
        this.email = input.email;
        this.company = input.company;
        this.country = input.country;
        return this;
    }
}

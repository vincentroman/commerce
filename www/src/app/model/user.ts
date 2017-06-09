import { RestModel } from "./rest-model";
import { Customer } from "./customer";

export class User extends RestModel<User> {
    email: string;
    password: string;
    roleAdmin: boolean = false;
    roleCustomer: boolean = false;
    customer: Customer;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            "email": this.email,
            "password": this.password,
            "roleAdmin": this.roleAdmin,
            "roleCustomer": this.roleCustomer,
            "customer": (this.customer ? this.customer.serialize() : null),
        });
    }

    deserialize(input: any): User {
        this._deserialize(input);
        this.email = input.email;
        this.password = "";
        this.roleAdmin = input.roleAdmin;
        this.roleCustomer = input.roleCustomer;
        this.customer = (input.customer ? new Customer().deserialize(input.customer) : null);
        return this;
    }
}

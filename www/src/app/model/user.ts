import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";

export class User extends RestModel implements Serializable<User> {
    email: string;
    displayName: string;
    password: string;

    serialize(): Object {
        return {
            "id": this.id,
            "email": this.email,
            "displayName": this.displayName,
            "password": this.password
        };
    }

    deserialize(input: any): User {
        this.id = input.id;
        this.email = input.email;
        this.displayName = input.displayName;
        this.password = "";
        return this;
    }
}

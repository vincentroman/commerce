import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";

export class Product extends RestModel implements Serializable<Product> {
    title: string;

    serialize(): Object {
        return {
            "uuid": this.uuid,
            "title": this.title
        };
    }

    deserialize(input: any): Product {
        this.uuid = input.uuid;
        this.title = input.title;
        return this;
    }
}

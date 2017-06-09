import { RestModel } from "./rest-model";

export class Product extends RestModel<Product> {
    title: string;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            "title": this.title
        });
    }

    deserialize(input: any): Product {
        this._deserialize(input);
        this.title = input.title;
        return this;
    }
}

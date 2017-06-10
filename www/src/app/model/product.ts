import { RestModel } from "./rest-model";

export class Product extends RestModel<Product> {
    title: string;
    licenseKeyIdentifier: string;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            "title": this.title,
            "licenseKeyIdentifier": this.licenseKeyIdentifier
        });
    }

    deserialize(input: any): Product {
        this._deserialize(input);
        this.title = input.title;
        this.licenseKeyIdentifier = input.licenseKeyIdentifier;
        return this;
    }
}

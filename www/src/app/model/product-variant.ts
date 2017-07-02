import { RestModel } from "./rest-model";
import { Product } from "./product";

export class ProductVariant extends RestModel<ProductVariant> {
    title: string;
    product: Product = new Product();
    type: ProductVariantType;
    numDomains: number;
    numSupportYears: number;
    price: number;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            "title": this.title,
            "product": (this.product ? this.product.serialize() : null),
            "type": this.type,
            "numDomains": this.numDomains,
            "numSupportYears": this.numSupportYears,
            "price": this.price
        });
    }

    deserialize(input: any): ProductVariant {
        this._deserialize(input);
        this.title = input.title;
        if (input.product) {
            this.product = new Product().deserialize(input.product);
        }
        this.type = input.type;
        this.numDomains = input.numDomains;
        this.numSupportYears = input.numSupportYears;
        this.price = input.price;
        return this;
    }
}

export enum ProductVariantType {
    TrialLicense = 1,
    LimitedLicense = 2,
    LifetimeLicense = 3,
    Eval = 4,
    SupportTicket = 5
}

import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";

export class ProductVariant extends RestModel implements Serializable<ProductVariant> {
    title: string;
    type: ProductVariantType;
    numDomains: number;
    numSupportYears: number;
    price: number;

    serialize(): Object {
        return {
            "uuid": this.uuid,
            "title": this.title,
            "type": this.type,
            "numDomains": this.numDomains,
            "numSupportYears": this.numSupportYears,
            "price": this.price
        };
    }

    deserialize(input: any): ProductVariant {
        this.uuid = input.uuid;
        this.title = input.title;
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

import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";

export class ProductVariant extends RestModel implements Serializable<ProductVariant> {
    type: ProductVariantType;

    serialize(): Object {
        return {
            "uuid": this.uuid,
            "type": this.type
        };
    }

    deserialize(input: any): ProductVariant {
        this.uuid = input.uuid;
        this.type = input.type;
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

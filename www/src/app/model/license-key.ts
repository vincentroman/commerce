import { RestModel } from "./rest-model";
import { ProductVariant } from "./product-variant";
import * as moment from "moment";
import { PurchaseItem } from "./purchase-item";
import { Person } from "./person";

export class LicenseKey extends RestModel<LicenseKey> {
    licenseKey: string;
    issueDate: moment.Moment;
    expiryDate: moment.Moment;
    productVariant: ProductVariant = new ProductVariant();
    customer: Person = new Person();
    purchaseItem: PurchaseItem = new PurchaseItem();
    expiresInDays: number;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            // Not supported
        });
    }

    deserialize(input: any): LicenseKey {
        this._deserialize(input);
        this.licenseKey = input.licenseKey;
        this.issueDate = (input.issueDate ? moment(input.issueDate, "YYYY-MM-DD HH:mm:ss") : null);
        this.expiryDate = (input.expiryDate ? moment(input.expiryDate, "YYYY-MM-DD HH:mm:ss") : null);
        this.productVariant = (input.productVariant ? new ProductVariant().deserialize(input.productVariant) : null);
        this.customer = (input.customer ? new Person().deserialize(input.customer) : null);
        this.purchaseItem = (input.purchaseItem ? new PurchaseItem().deserialize(input.purchaseItem) : null);
        this.expiresInDays = input.expiresInDays;
        return this;
    }
}

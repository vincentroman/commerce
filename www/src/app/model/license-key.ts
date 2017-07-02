import { RestModel } from "./rest-model";
import { ProductVariant } from "./product-variant";
import { Customer } from "./customer";
import * as moment from "moment";
import { PurchaseItem } from "./purchase-item";

export class LicenseKey extends RestModel<LicenseKey> {
    licenseKey: string;
    issueDate: moment.Moment;
    expiryDate: moment.Moment;
    productVariant: ProductVariant = new ProductVariant();
    customer: Customer = new Customer();
    purchaseItem: PurchaseItem = new PurchaseItem();

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
        this.customer = (input.customer ? new Customer().deserialize(input.customer) : null);
        this.purchaseItem = (input.purchaseItem ? new PurchaseItem().deserialize(input.purchaseItem) : null);
        return this;
    }
}

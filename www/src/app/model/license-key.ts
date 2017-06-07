import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";
import { ProductVariant } from "./product-variant";
import { Customer } from "./customer";
import * as moment from "moment";
import { PurchaseItem } from "./purchase-item";

export class LicenseKey extends RestModel implements Serializable<LicenseKey> {
    licenseKey: string;
    issueDate: moment.Moment;
    productVariant: ProductVariant;
    customer: Customer;
    purchaseItem: PurchaseItem;

    serialize(): Object {
        return {
            // Not supported
        };
    }

    deserialize(input: any): LicenseKey {
        this.uuid = input.uuid;
        this.licenseKey = input.licenseKey;
        this.issueDate = (input.issueDate ? moment(input.issueDate, "YYYY-MM-DD HH:mm:ss") : null);
        this.productVariant = (input.productVariant ? new ProductVariant().deserialize(input.productVariant) : null);
        this.customer = (input.customer ? new Customer().deserialize(input.customer) : null);
        this.purchaseItem = (input.purchaseItem ? new PurchaseItem().deserialize(input.purchaseItem) : null);
        return this;
    }
}

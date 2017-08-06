import { RestModel } from "./rest-model";
import { ProductVariant } from "./product-variant";
import * as moment from "moment";
import { PurchaseItem } from "./purchase-item";
import { Person } from "./person";

export class SupportTicket extends RestModel<SupportTicket> {
    text: string;
    sendDate: moment.Moment;
    productVariant: ProductVariant = new ProductVariant();
    customer: Person = new Person();
    purchaseItem: PurchaseItem = new PurchaseItem();
    status: SupportRequestStatus;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            // Not supported
        });
    }

    deserialize(input: any): SupportTicket {
        this._deserialize(input);
        this.text = input.text;
        this.sendDate = (input.sendDate ? moment(input.sendDate, "YYYY-MM-DD HH:mm:ss") : null);
        this.productVariant = (input.productVariant ? new ProductVariant().deserialize(input.productVariant) : null);
        this.customer = (input.customer ? new Person().deserialize(input.customer) : null);
        this.purchaseItem = (input.purchaseItem ? new PurchaseItem().deserialize(input.purchaseItem) : null);
        this.status = input.status;
        return this;
    }
}

export enum SupportRequestStatus {
    NEW = 1,
    OPEN = 2,
    CLOSED = 3
}

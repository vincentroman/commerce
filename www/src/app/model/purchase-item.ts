import { RestModel } from "./rest-model";
import { ProductVariant } from "./product-variant";
import { Purchase } from "./purchase";

export class PurchaseItem extends RestModel<PurchaseItem> {
    purchaseId: string;
    productVariant: ProductVariant;
    quantity: number;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            // Not supported
        });
    }

    deserialize(input: any): PurchaseItem {
        this._deserialize(input);
        this.purchaseId = input.purchaseId;
        this.productVariant = (input.productVariant ? new ProductVariant().deserialize(input.productVariant) : null);
        this.quantity = input.quantity;
        return this;
    }
}

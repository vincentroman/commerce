import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";
import { ProductVariant } from "./product-variant";
import { Purchase } from "./purchase";

export class PurchaseItem extends RestModel implements Serializable<PurchaseItem> {
    purchase: Purchase;
    productVariant: ProductVariant;
    quantity: number;

    serialize(): Object {
        return {
            // Not supported
        };
    }

    deserialize(input: any): PurchaseItem {
        this.uuid = input.uuid;
        this.purchase = (input.purchase ? new Purchase().deserialize(input.purchase) : null);
        this.productVariant = (input.productVariant ? new ProductVariant().deserialize(input.productVariant) : null);
        this.quantity = input.quantity;
        return this;
    }
}

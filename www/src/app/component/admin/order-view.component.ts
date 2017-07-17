import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "../entity-edit.component";
import { PurchaseService } from "../../service/purchase.service";
import { Purchase } from "../../model/purchase";
import { PurchaseItem } from "../../model/purchase-item";

@Component({
    templateUrl: "./order-view.component.html",
    providers: [
        PurchaseService
    ]
})
export class OrderViewComponent extends EntityEditComponent<Purchase> {
    purchaseItems: PurchaseItem[] = [];

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected purchaseService: PurchaseService
    ) {
        super(route, router, purchaseService);
    }

    protected onInit(): void {
        this.purchaseService.getPurchaseItems(this.uuid).then(items => this.purchaseItems = items);
    }

    protected newTypeInstance(): Purchase {
        return new Purchase();
    }

    protected getListPath(): string {
        return "/admin/orders";
    }
}

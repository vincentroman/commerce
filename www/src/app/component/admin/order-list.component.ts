import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "../entity-list.component";
import { Purchase } from "../../model/purchase";
import { PurchaseService } from "../../service/purchase.service";

@Component({
    templateUrl: "./order-list.component.html",
    providers: [
        PurchaseService
    ]
})
export class OrderListComponent extends EntityListComponent<Purchase> {
    constructor(
        protected router: Router,
        protected purchaseService: PurchaseService
    ) {
        super(router, purchaseService);
    }

    protected getEditPath(): string {
        return "/admin/orders/edit";
    }
}

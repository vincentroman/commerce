import { Component, Input, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { SystemSettingService } from "../service/systemsetting.service";
import { PurchaseService } from "../service/purchase.service";

@Component({
    templateUrl: "./confirm-order.component.html",
    providers: [
        PurchaseService
    ]
})
export class ConfirmOrderComponent implements OnInit {
    uuid: string = "";
    pendingOrder: any = null;
    loading: boolean = true;
    submitting: boolean = false;
    success: boolean = false;
    error: boolean = false;
    settings: any = {};

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private settingsService: SystemSettingService,
        private purchaseService: PurchaseService
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let uuid: string = params["uuid"];
            if (uuid) {
                this.uuid = uuid;
                this.purchaseService.getPendingOrder(uuid).then(order => {
                    this.pendingOrder = order;
                    this.loading = false;
                }).catch(e => this.error = true);
            }
        });
        this.settingsService.getPublicSettings().then(settings => this.settings = settings);
    }

    submit(): void {
        this.submitting = true;
        this.success = false;
        this.purchaseService.confirmOrder(this.uuid)
            .then(entity => {
                this.submitting = false;
                this.success = true;
            }).catch(e => {
                this.submitting = false;
                this.error = true;
            });
    }
}

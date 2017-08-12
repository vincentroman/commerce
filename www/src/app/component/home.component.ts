import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "../service/session.service";
import { SupportTicketService, SupportTicketStats } from "../service/support-ticket.service";
import { LicenseKeyStats, LicenseKeyService } from "../service/license-key.service";
import { PurchaseService } from "../service/purchase.service";
import { Purchase } from "../model/purchase";

@Component({
    templateUrl: "./home.component.html",
    providers: [
        SupportTicketService,
        LicenseKeyService,
        PurchaseService
    ]
})
export class HomeComponent implements OnInit {
    session: SessionService;
    supportTicketStats: SupportTicketStats = null;
    licenseKeyStats: LicenseKeyStats = null;
    supportRequestsStats: SupportTicketStats = null;
    latestOrders: Purchase[] = null;

    constructor(
        private sessionService: SessionService,
        private supportTicketService: SupportTicketService,
        private licenseKeyService: LicenseKeyService,
        private purchaseService: PurchaseService
    ) {
        this.session = sessionService;
    }

    ngOnInit(): void {
        if (this.sessionService.user.roleCustomer) {
            this.supportTicketService.myStats().then(stats => this.supportTicketStats = stats);
            this.licenseKeyService.myStats().then(stats => this.licenseKeyStats = stats);
        }
        if (this.sessionService.user.roleAdmin) {
            this.supportTicketService.adminStats().then(stats => this.supportRequestsStats = stats);
            this.purchaseService.latestOrders(5).then(latest => this.latestOrders = latest);
        }
    }
}

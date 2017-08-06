import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "../service/session.service";
import { SupportTicketService, SupportTicketStats } from "../service/support-ticket.service";
import { LicenseKeyStats, LicenseKeyService } from "../service/license-key.service";

@Component({
    templateUrl: "./home.component.html",
    providers: [
        SupportTicketService,
        LicenseKeyService
    ]
})
export class HomeComponent implements OnInit {
    session: SessionService;
    supportTicketStats: SupportTicketStats = null;
    licenseKeyStats: LicenseKeyStats = null;

    constructor(
        private sessionService: SessionService,
        private supportTicketService: SupportTicketService,
        private licenseKeyService: LicenseKeyService
    ) {
        this.session = sessionService;
    }

    ngOnInit(): void {
        if (this.sessionService.user.roleCustomer) {
            this.supportTicketService.myStats().then(stats => this.supportTicketStats = stats);
            this.licenseKeyService.myStats().then(stats => this.licenseKeyStats = stats);
        }
    }
}

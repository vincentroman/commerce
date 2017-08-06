import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "../service/session.service";
import { SupportTicketService, SupportTicketStats } from "../service/support-ticket.service";

@Component({
    templateUrl: "./home.component.html",
    providers: [
        SupportTicketService
    ]
})
export class HomeComponent implements OnInit {
    session: SessionService;
    supportTicketStats: SupportTicketStats = null;

    constructor(
        private sessionService: SessionService,
        private supportTicketService: SupportTicketService
    ) {
        this.session = sessionService;
    }

    ngOnInit(): void {
        if (this.sessionService.user.roleCustomer) {
            this.supportTicketService.myStats().then(stats => this.supportTicketStats = stats);
        }
    }
}

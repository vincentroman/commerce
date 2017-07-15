import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "../entity-list.component";
import { SupportTicketService } from "../../service/support-ticket.service";
import { SupportTicket, SupportRequestStatus } from "../../model/support-ticket";

@Component({
    templateUrl: "./support-request-list.component.html",
    providers: [
        SupportTicketService
    ]
})
export class SupportRequestListComponent extends EntityListComponent<SupportTicket> {
    constructor(
        protected router: Router,
        protected supportTicketService: SupportTicketService
    ) {
        super(router, supportTicketService);
    }

    protected getEditPath(): string {
        return "/admin/supportrequests/view";
    }

    public getStatus(ticket: SupportTicket): string {
        if (ticket.status === SupportRequestStatus.NEW) {
            return "New";
        } else if (ticket.status === SupportRequestStatus.OPEN) {
            return "Open";
        } else if (ticket.status === SupportRequestStatus.CLOSED) {
            return "Closed";
        } else {
            return "Unknown";
        }
    }
}

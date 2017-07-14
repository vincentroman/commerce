import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "../entity-list.component";
import { SupportTicketService } from "../../service/support-ticket.service";
import { SupportTicket } from "../../model/support-ticket";

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
        return "/admin/supportrequests/edit";
    }
}

import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { SupportTicket, SupportRequestStatus } from "../../model/support-ticket";
import { SupportTicketService } from "../../service/support-ticket.service";
import { Comment } from "../../model/comment";

@Component({
    templateUrl: "./tickets-view.component.html",
    providers: [
        SupportTicketService
    ]
})
export class TicketsMyViewComponent implements OnInit {
    entity: SupportTicket = new SupportTicket();
    comments: Comment[] = [];
    submitting: boolean = false;
    caseOpenedClosed: boolean = false;
    commentAdded: boolean = false;
    error: boolean = false;
    uuid: string = "";
    model = {
        text: ""
    };

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected supportTicketService: SupportTicketService
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let uuid: string = params["uuid"];
            if (uuid) {
                this.uuid = uuid;
            }
        });
        this.supportTicketService.get(this.uuid).then(entity => this.entity = entity);
        this.supportTicketService.getComments(this.uuid).then(comments => this.comments = comments);
    }

    submit(): void {
        this.submitting = true;
        this.commentAdded = false;
        this.caseOpenedClosed = false;
        if (this.entity.status === SupportRequestStatus.NEW) {
            this.openCase();
        } else {
            this.closeCase();
        }
    }

    private openCase(): void {
        this.supportTicketService.open(this.uuid, this.entity.text)
            .then(entity => {
                this.supportTicketService.get(this.uuid).then(entity => {
                    this.entity = entity;
                    this.submitting = false;
                    this.caseOpenedClosed = true;
                });
            });
    }

    private closeCase(): void {
        if (!confirm("Do you really want to close this case?")) {
            this.submitting = false;
            return;
        }
        this.supportTicketService.close(this.uuid)
            .then(entity => {
                this.supportTicketService.get(this.uuid).then(entity => {
                    this.entity = entity;
                    this.submitting = false;
                    this.caseOpenedClosed = true;
                });
            });
    }

    addComment(): void {
        this.submitting = true;
        this.commentAdded = false;
        this.caseOpenedClosed = false;
        this.supportTicketService.addComment(this.uuid, this.model.text)
            .then(licenseKey => {
                this.supportTicketService.getComments(this.uuid).then(comments => {
                    this.comments = comments;
                    this.model.text = "";
                    this.commentAdded = true;
                    this.submitting = false;
                });
            });
    }
}

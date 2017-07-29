import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "../entity-edit.component";
import { Customer } from "../../model/customer";
import { Comment } from "../../model/comment";
import { CustomerService } from "../../service/customer.service";

@Component({
    templateUrl: "./customer-edit.component.html",
    providers: [
        CustomerService
    ]
})
export class CustomerEditComponent extends EntityEditComponent<Customer> {
    comments: Comment[] = [];
    commentAdded: boolean = false;
    model = {
        text: ""
    };

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected customerService: CustomerService
    ) {
        super(route, router, customerService);
    }

    protected newTypeInstance(): Customer {
        return new Customer();
    }

    protected getListPath(): string {
        return "/admin/customers";
    }

    protected onInit(): void {
        this.customerService.getComments(this.uuid).then(comments => this.comments = comments);
    }

    addComment(): void {
        this.submitting = true;
        this.commentAdded = false;
        this.customerService.addComment(this.uuid, this.model.text)
            .then(comment => {
                this.customerService.getComments(this.uuid).then(comments => {
                    this.comments = comments;
                    this.model.text = "";
                    this.commentAdded = true;
                    this.submitting = false;
                });
            });
    }
}

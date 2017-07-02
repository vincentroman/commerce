import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "../entity-list.component";
import { Customer } from "../../model/customer";
import { CustomerService } from "../../service/customer.service";

@Component({
    templateUrl: "./customer-list.component.html",
    providers: [
        CustomerService
    ]
})
export class CustomerListComponent extends EntityListComponent<Customer> {
    constructor(
        protected router: Router,
        protected customerService: CustomerService
    ) {
        super(router, customerService);
    }

    protected getEditPath(): string {
        return "/admin/customers/edit";
    }
}

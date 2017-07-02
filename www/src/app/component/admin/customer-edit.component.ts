import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "../entity-edit.component";
import { Customer } from "../../model/customer";
import { CustomerService } from "../../service/customer.service";

@Component({
    templateUrl: "./customer-edit.component.html",
    providers: [
        CustomerService
    ]
})
export class CustomerEditComponent extends EntityEditComponent<Customer> {
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
}

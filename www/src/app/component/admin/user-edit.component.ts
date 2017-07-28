import { Component, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "../entity-edit.component";
import { User } from "../../model/user";
import { UserService } from "../../service/user.service";
import { CustomerService } from "../../service/customer.service";
import { Customer } from "../../model/customer";

@Component({
    templateUrl: "./user-edit.component.html",
    providers: [
        UserService,
        CustomerService
    ]
})
export class UserEditComponent extends EntityEditComponent<User> implements AfterViewInit {
    changePassword: boolean = false;
    assignCustomerMode: boolean = false;
    customerUuid: string = "";

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected userService: UserService,
        private customerService: CustomerService
    ) {
        super(route, router, userService);
    }

    protected newTypeInstance(): User {
        return new User();
    }

    protected getListPath(): string {
        return "/admin/users";
    }

    private initTypeahead(): void {
        let that = this;
        let options: Twitter.Typeahead.Options = {
            hint: true,
            highlight: true,
            minLength: 1
        };
        let dataset: Twitter.Typeahead.Dataset<Object> = {
            name: "customers",
            display: "value",
            source: this.customerService.getCustomerSuggestionBloodhoundSource()
        };
        $("input#customer")
            .typeahead(options, dataset)
            .on("typeahead:select", function(ev, suggestion): boolean {
                that.customerUuid = suggestion.id;
                return true;
            });
    }

    protected onEntityLoaded(): void {
        if (this.entity.customer) {
            this.customerUuid = this.entity.customer.uuid;
        }
    }

    ngAfterViewInit() {
        this.initTypeahead();
    }

    submit(): void {
        if (this.uuid && !this.changePassword) {
            this.entity.password = "";
        }
        if (this.customerUuid) {
            if (!this.entity.customer) {
                this.entity.customer = new Customer();
            }
            this.entity.customer.uuid = this.customerUuid;
        } else {
            this.entity.customer = null;
        }
        super.submit();
    }

    enterAssignCustomerMode(): void {
        this.assignCustomerMode = true;
        window.setTimeout(function() {
            $("input#customer").focus();
        }, 100);
    }

    cancelAssignCustomerMode(): void {
        this.assignCustomerMode = false;
    }

    removeCustomerAssignment(): void {
        this.customerUuid = "";
        this.entity.customer = null;
        this.cancelAssignCustomerMode();
    }
}

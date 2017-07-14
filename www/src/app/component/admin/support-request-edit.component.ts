import { Component, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "../entity-edit.component";
import { Product } from "../../model/product";
import { ProductVariantService } from "../../service/product-variant.service";
import { ProductService } from "../../service/product.service";
import { ProductVariant, ProductVariantType } from "../../model/product-variant";
import { CustomerService } from "../../service/customer.service";
import * as $ from "jquery";
import * as typeahead from "typeahead.js";
import { SupportTicket } from "../../model/support-ticket";
import { SupportTicketService } from "../../service/support-ticket.service";

@Component({
    templateUrl: "./support-request-edit.component.html",
    providers: [
        SupportTicketService,
        ProductService,
        ProductVariantService,
        CustomerService
    ]
})
export class SupportRequestEditComponent extends EntityEditComponent<SupportTicket> implements AfterViewInit {
    products: Product[] = [];
    productVariants: ProductVariant[] = [];
    model = {
        productVariantId: "",
        customerUuid: ""
    };

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected supportTicketService: SupportTicketService,
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private customerService: CustomerService
    ) {
        super(route, router, supportTicketService);
    }

    protected onInit(): void {
        this.productService.list().then(products => this.products = products);
        this.productVariantService.list().then(productVariants => this.productVariants = productVariants);
    }

    ngAfterViewInit() {
        this.initTypeahead();
    }

    protected newTypeInstance(): SupportTicket {
        return new SupportTicket();
    }

    protected getListPath(): string {
        return "/admin/supportrequests";
    }

    submit(): void {
        this.submitting = true;
        this.success = false;
        this.supportTicketService.assign(this.model.productVariantId, this.model.customerUuid)
            .then(uuid => {
                this.submitting = false;
                this.success = true;
            });
    }

    private getProductVariantByUuid(uuid: string): ProductVariant {
        let result: ProductVariant = null;
        this.productVariants.forEach(variant => {
            if (variant.uuid === uuid) {
                result = variant;
            }
        });
        return result;
    }

    public getProductVariantsForProduct(uuid: string): ProductVariant[] {
        let result: ProductVariant[] = [];
        this.productVariants.forEach(variant => {
            if (variant.product && variant.product.uuid === uuid) {
                result.push(variant);
            }
        });
        return result;
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
                that.model.customerUuid = suggestion.id;
                return true;
            });
    }
}

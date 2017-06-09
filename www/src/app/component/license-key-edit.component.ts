import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "./entity-edit.component";
import { LicenseKeyService } from "../service/license-key.service";
import { LicenseKey } from "../model/license-key";
import { Product } from "../model/product";
import { ProductVariantService } from "../service/product-variant.service";
import { ProductService } from "../service/product.service";
import { ProductVariant, ProductVariantType } from "../model/product-variant";
import { CustomerService } from "../service/customer.service";
import * as $ from "jquery";
import * as typeahead from "typeahead.js";

@Component({
    templateUrl: "./license-key-edit.component.html",
    providers: [
        LicenseKeyService,
        ProductService,
        ProductVariantService,
        CustomerService
    ]
})
export class LicenseKeyEditComponent extends EntityEditComponent<LicenseKey> {
    products: Product[] = [];
    productVariants: ProductVariant[] = [];
    licenseTypes = [
        {id: ProductVariantType.Eval, label: "Evaluation"},
        {id: ProductVariantType.LifetimeLicense, label: "Lifetime"},
        {id: ProductVariantType.LimitedLicense, label: "Limited"},
        {id: ProductVariantType.TrialLicense, label: "Trial"}
    ];
    model = {
        productVariantId: "",
        mode: "",
        licenseType: "",
        uuid: "",
        onlineVerification: false,
        owner: "",
        validMonths: 0,
        wildcard: false,
        domains: "",
        customerUuid: ""
    };

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected licenseKeyService: LicenseKeyService,
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private customerService: CustomerService
    ) {
        super(route, router, licenseKeyService);
    }

    protected onInit(): void {
        this.productService.list().then(products => this.products = products);
        this.productVariantService.list().then(productVariants => this.productVariants = productVariants);
        this.initTypeahead();
    }

    protected newTypeInstance(): LicenseKey {
        return new LicenseKey();
    }

    protected getListPath(): string {
        return "/licensekeys";
    }

    submit(): void {
        this.submitting = true;
        this.success = false;
        if (this.model.mode === "assign") {
            this.assignLicenseKey();
        } else if (this.model.mode === "generate") {
            this.generateLicenseKey();
        }
    }

    private assignLicenseKey(): void {
        this.licenseKeyService.assign(this.model.productVariantId, this.model.customerUuid)
            .then(uuid => {
                this.submitting = false;
                this.success = true;
            });
    }

    private generateLicenseKey(): void {
        // TODO
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

    public setMode(mode: string): void {
        this.model.mode = mode;
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
                console.log("Selected customer uuid = %s", that.model.customerUuid);
                return true;
            });
    }
}

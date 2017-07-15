import { Component, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "../entity-edit.component";
import { LicenseKeyService, LicenseGenerationDetails } from "../../service/license-key.service";
import { LicenseKey } from "../../model/license-key";
import { Product } from "../../model/product";
import { ProductVariantService } from "../../service/product-variant.service";
import { ProductService } from "../../service/product.service";
import { ProductVariant, ProductVariantType } from "../../model/product-variant";
import { CustomerService } from "../../service/customer.service";
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
export class LicenseKeyEditComponent extends EntityEditComponent<LicenseKey> implements AfterViewInit {
    products: Product[] = [];
    productVariants: ProductVariant[] = [];
    licenseTypes = [
        {id: "lifetime", label: "Lifetime"},
        {id: "limited", label: "Limited"},
        {id: "trial", label: "Trial"}
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
        customerUuid: "",
        licenseKey: ""
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
    }

    ngAfterViewInit() {
        this.initTypeahead();
    }

    protected newTypeInstance(): LicenseKey {
        return new LicenseKey();
    }

    protected getListPath(): string {
        return "/admin/licensekeys";
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
        let details: LicenseGenerationDetails = {
            productUuid: this.getProductVariantByUuid(this.model.productVariantId).product.uuid,
            type: this.getLicenseType(),
            uuid: this.model.uuid,
            onlineVerification: this.model.onlineVerification,
            domains: this.getDomainList(),
            owner: this.model.owner,
            validMonths: this.model.validMonths,
            wildcard: this.model.wildcard
        };
        this.licenseKeyService.generate(details)
            .then(licenseKey => {
                this.model.licenseKey = licenseKey;
                this.submitting = false;
                this.success = true;
            });
    }

    private getDomainList(): string[] {
        let tokens: string[] = this.model.domains.split("\n");
        let result: string[] = [];
        tokens.forEach(token => {
            token = token.trim();
            if (token) {
                result.push(token);
            }
        });
        return result;
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

    public getProductsWithLicenseVariants(): Product[] {
        let result: Product[] = [];
        this.products.forEach(product => {
            if (this.getProductVariantsForProduct(product.uuid).length > 0) {
                result.push(product);
            }
        });
        return result;
    }

    private getLicenseType(): "trial" | "limited" | "lifetime" {
        if (this.model.licenseType === "lifetime") {
            return "lifetime";
        } else if (this.model.licenseType === "limited") {
            return "limited";
        } else {
            return "trial";
        }
    }

    public getProductVariantsForProduct(uuid: string): ProductVariant[] {
        let result: ProductVariant[] = [];
        this.productVariants.forEach(variant => {
            if (variant.product && variant.product.uuid === uuid && variant.type !== ProductVariantType.SupportTicket) {
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
                return true;
            });
    }
}

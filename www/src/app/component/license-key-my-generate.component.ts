import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { EntityEditComponent } from "./entity-edit.component";
import { LicenseKeyService, LicenseGenerationDetails } from "../service/license-key.service";
import { LicenseKey } from "../model/license-key";
import { Product } from "../model/product";
import { ProductVariantService } from "../service/product-variant.service";
import { ProductService } from "../service/product.service";
import { ProductVariant, ProductVariantType } from "../model/product-variant";
import { CustomerService } from "../service/customer.service";
import * as $ from "jquery";
import * as typeahead from "typeahead.js";

@Component({
    templateUrl: "./license-key-my-generate.component.html",
    providers: [
        LicenseKeyService,
        ProductService,
        ProductVariantService,
        CustomerService
    ]
})
export class LicenseKeyMyGenerateComponent implements OnInit {
    entity: LicenseKey = new LicenseKey();
    submitting: boolean = false;
    success: boolean = false;
    error: boolean = false;
    uuid: string = "";
    model = {
        domains: []
    };

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected licenseKeyService: LicenseKeyService
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let uuid: string = params["uuid"];
            if (uuid) {
                this.uuid = uuid;
            }
        });
        this.licenseKeyService.getMyOne(this.uuid).then(entity => {
            this.entity = entity;
            for (let i = 0; i < entity.productVariant.numDomains; i++) {
                this.model.domains.push("");
            }
        });
    }

    submit(): void {
        this.submitting = true;
        this.success = false;
        this.licenseKeyService.issue(this.uuid, this.model.domains)
            .then(licenseKey => {
                this.entity.licenseKey = licenseKey;
                this.submitting = false;
                this.success = true;
                this.router.navigate(["/licensekeys/my/view", this.uuid]);
            });
    }
}

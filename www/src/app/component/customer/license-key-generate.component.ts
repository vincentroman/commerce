import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { LicenseKeyService } from "../../service/license-key.service";
import { LicenseKey } from "../../model/license-key";

@Component({
    templateUrl: "./license-key-generate.component.html",
    providers: [
        LicenseKeyService
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
                this.model.domains.push({value: ""});
            }
        });
    }

    submit(): void {
        this.submitting = true;
        this.success = false;
        let domains = this.model.domains.map(o => o.value);
        this.licenseKeyService.issue(this.uuid, domains)
            .then(licenseKey => {
                this.entity.licenseKey = licenseKey;
                this.submitting = false;
                this.success = true;
                this.router.navigate(["/customer/licensekeys/view", this.uuid]);
            });
    }
}
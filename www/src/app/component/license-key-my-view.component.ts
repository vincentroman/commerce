import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { LicenseKeyService } from "../service/license-key.service";
import { LicenseKey } from "../model/license-key";

@Component({
    templateUrl: "./license-key-my-view.component.html",
    providers: [
        LicenseKeyService
    ]
})
export class LicenseKeyMyViewComponent implements OnInit {
    entity: LicenseKey = new LicenseKey();
    uuid: string = "";

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
        });
    }
}

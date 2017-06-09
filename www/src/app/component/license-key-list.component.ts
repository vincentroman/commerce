import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "./entity-list.component";
import { LicenseKeyService } from "../service/license-key.service";
import { LicenseKey } from "../model/license-key";

@Component({
    templateUrl: "./license-key-list.component.html",
    providers: [
        LicenseKeyService
    ]
})
export class LicenseKeyListComponent extends EntityListComponent<LicenseKey> {
    constructor(
        protected router: Router,
        protected licenseKeyService: LicenseKeyService
    ) {
        super(router, licenseKeyService);
    }

    protected getEditPath(): string {
        return "/licensekeys/edit";
    }
}

import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "./entity-list.component";
import { LicenseKeyService } from "../service/license-key.service";
import { LicenseKey } from "../model/license-key";

@Component({
    templateUrl: "./license-key-my-list.component.html",
    providers: [
        LicenseKeyService
    ]
})
export class LicenseKeyMyListComponent extends EntityListComponent<LicenseKey> {
    constructor(
        protected router: Router,
        protected licenseKeyService: LicenseKeyService
    ) {
        super(router, licenseKeyService);
    }

    protected loadList(): void {
        this.licenseKeyService.my().then(entities => this.entities = entities);
    }

    protected getEditPath(): string {
        return "/licensekeys/view";
    }

    public viewEditKey(licenseKey: LicenseKey): void {
        if (licenseKey.licenseKey) {
            this.router.navigate(["/licensekeys/my/view", licenseKey.uuid]);
        } else {
            this.router.navigate(["/licensekeys/my/generate", licenseKey.uuid]);
        }
    }
}

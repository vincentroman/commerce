import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "./entity-list.component";
import { SystemSettingService } from "../service/systemsetting.service";
import { SystemSetting } from "../model/systemsetting";

@Component({
    templateUrl: "./systemsetting-list.component.html",
    providers: [
        SystemSettingService
    ]
})
export class SystemSettingListComponent extends EntityListComponent<SystemSetting> {
    constructor(
        protected router: Router,
        protected systemSettingService: SystemSettingService
    ) {
        super(router, systemSettingService);
    }

    protected getEditPath(): string {
        return "/systemsettings/edit";
    }
}

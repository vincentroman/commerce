import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "./entity-edit.component";
import { SystemSettingService } from "../service/systemsetting.service";
import { SystemSetting } from "../model/systemsetting";

@Component({
    templateUrl: "./systemsetting-edit.component.html",
    providers: [
        SystemSettingService
    ]
})
export class SystemSettingEditComponent extends EntityEditComponent<SystemSetting> {
    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected systemSettingService: SystemSettingService
    ) {
        super(route, router, systemSettingService);
    }

    protected newTypeInstance(): SystemSetting {
        return new SystemSetting();
    }

    protected getListPath(): string {
        return "/systemsettings";
    }
}

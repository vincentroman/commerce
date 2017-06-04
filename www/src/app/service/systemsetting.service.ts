import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { SystemSetting } from "../model/systemsetting";

@Injectable()
export class SystemSettingService extends CrudService<SystemSetting> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): SystemSetting {
        return new SystemSetting();
    }

    protected getPath(): string {
        return "systemsetting";
    }
}

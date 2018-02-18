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

    public getVersion(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/version"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let version: number = parseInt(res.text(), 10);
                resolve(version);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    public getPublicSettings(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/public"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let settings: number = res.json();
                resolve(settings);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }
}

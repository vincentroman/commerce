import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { LicenseKey } from "../model/license-key";

@Injectable()
export class LicenseKeyService extends CrudService<LicenseKey> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): LicenseKey {
        return new LicenseKey();
    }

    protected getPath(): string {
        return "licensekey";
    }

    assign(productVariantUuid: string, customerUuid: string): Promise<string> {
        let payload = {
            productVariantUuid: productVariantUuid,
            customerUuid: customerUuid
        };
        return this.http.put(this.httpService.getUrl(this.getPath() + "/assign"), payload, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return res.json().uuid;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }
}

import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { LicenseKey } from "../model/license-key";
import { ProductVariantType } from "../model/product-variant";

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

    my(): Promise<LicenseKey[]> {
        return this.http
            .get(this.httpService.getUrl(this.getPath() + "/my"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: LicenseKey[] = (<LicenseKey[]>res.json()).map(o => this.newTypeInstance().deserialize(o));
                return list;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    getMyOne(id: string): Promise<LicenseKey> {
        return this.http
            .get(this.httpService.getUrl(this.getPath() + "/getmyone/" + id), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let entity = this.newTypeInstance().deserialize(<LicenseKey>res.json());
                return entity;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
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

    issue(id: string, domains: string[]): Promise<string> {
        let payload = {
            domains: domains
        };
        return this.http.post(this.httpService.getUrl(this.getPath() + "/issue/" + id), payload, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return res.json().uuid;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    generate(details: LicenseGenerationDetails): Promise<string> {
        return this.http.post(this.httpService.getUrl(this.getPath() + "/generate"), details, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return res.json().licenseKey;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }
}

export interface LicenseGenerationDetails {
    productUuid: string;
    type: "trial" | "limited" | "lifetime";
    uuid: string;
    onlineVerification: boolean;
    owner: string;
    validMonths: number;
    wildcard: boolean;
    domains: string[];
}

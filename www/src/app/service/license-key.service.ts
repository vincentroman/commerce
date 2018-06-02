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
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/my"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: LicenseKey[] = (<LicenseKey[]>res.json()).map(o => this.newTypeInstance().deserialize(o));
                resolve(list);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    myStats(): Promise<LicenseKeyStats> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/mystats"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let entity = <LicenseKeyStats>res.json();
                resolve(entity);
            })
            .catch(error => reject(this.httpService.handleError(error)));
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
                throw this.httpService.handleError(error);
            });
    }

    issue(id: string, domains: string[]): Promise<string> {
        let payload = {
            domains: domains
        };
        return this.http.post(this.httpService.getUrl(this.getPath() + "/" + id + "/issue"), payload, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                console.log("status: %d", res.status);
                return res.json().uuid;
            })
            .catch(error => {
                throw this.httpService.handleError(error);
            });
    }

    generate(details: LicenseGenerationDetails): Promise<string> {
        return this.http.post(this.httpService.getUrl(this.getPath() + "/generate"), details, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return res.json().licenseKey;
            })
            .catch(error => {
                throw this.httpService.handleError(error);
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

export declare class LicenseKeyStats {
    numKeys: number;
    numNearlyExpired: number;
    numExpired: number;
    numNotIssued: number;
    numIssuedAndOkay: number;
}

export enum LicenseKeyErrorCode {
    INVALID_TLD = 101,
    TLD_EMPTY = 102,
    DOMAIN_EQUALS_TLD = 103,
    DOMAIN_EMPTY = 104
}

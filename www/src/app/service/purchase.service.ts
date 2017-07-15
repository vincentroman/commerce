import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { Purchase } from "../model/purchase";

@Injectable()
export class PurchaseService extends CrudService<Purchase> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): Purchase {
        return new Purchase();
    }

    protected getPath(): string {
        return "purchase";
    }
}

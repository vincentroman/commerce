import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { Purchase } from "../model/purchase";
import { PurchaseItem } from "../model/purchase-item";

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

    public getPurchaseItems(uuid: string): Promise<PurchaseItem[]> {
        return this.http
            .get(this.httpService.getUrl("purchaseitem/" + uuid + "/list"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: PurchaseItem[] = (<PurchaseItem[]>res.json()).map(o => new PurchaseItem().deserialize(o));
                return list;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }
}

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
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl("purchaseitem/" + uuid + "/list"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: PurchaseItem[] = (<PurchaseItem[]>res.json()).map(o => new PurchaseItem().deserialize(o));
                resolve(list);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    public latestOrders(limit: number): Promise<Purchase[]> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/latest/" + limit), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: Purchase[] = (<Purchase[]>res.json()).map(o => new Purchase().deserialize(o));
                resolve(list);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    public getPendingOrder(uuid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/pending/" + uuid), this.httpService.getOptions())
            .toPromise()
            .then(res => resolve(res.json()))
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    public confirmOrder(uuid: string): Promise<Purchase> {
        let payload = {
            uuid: uuid
        };
        return new Promise((resolve, reject) => {
            this.http
            .post(this.httpService.getUrl("ordernotification/confirm"), payload, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let result: Purchase = new Purchase().deserialize(res.json());
                resolve(result);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }
}

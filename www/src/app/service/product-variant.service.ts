import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { ProductVariant } from "../model/product-variant";
import { BrokerProductVariant } from "../model/broker-product-variant";

@Injectable()
export class ProductVariantService extends CrudService<ProductVariant> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): ProductVariant {
        return new ProductVariant();
    }

    protected getPath(): string {
        return "productvariant";
    }

    public getBrokerProductVariant(brokerUuid: string, variantUuid: string): Promise<BrokerProductVariant> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl("brokerproductvariant/" + variantUuid + "/" + brokerUuid + "/get"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let bpv: BrokerProductVariant = new BrokerProductVariant().deserialize(res.json());
                resolve(bpv);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    public getBrokerProductVariants(productUuid: string): Promise<BrokerProductVariant[]> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl("brokerproductvariant/" + productUuid + "/list"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: BrokerProductVariant[] = (<BrokerProductVariant[]>res.json()).map(o => new BrokerProductVariant().deserialize(o));
                resolve(list);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    public saveBrokerProductVariant(productUuid: string, bpv: BrokerProductVariant): Promise<BrokerProductVariant> {
        return new Promise((resolve, reject) => {
            this.http.put(this.httpService.getUrl("brokerproductvariant/" + productUuid + "/save"),
                bpv.serialize(), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                bpv.uuid = res.json().uuid;
                resolve(bpv);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }
}

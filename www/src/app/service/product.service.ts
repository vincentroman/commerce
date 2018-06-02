import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { Product } from "../model/product";
import { ProductVariant } from "../model/product-variant";

@Injectable()
export class ProductService extends CrudService<Product> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): Product {
        return new Product();
    }

    protected getPath(): string {
        return "product";
    }

    listVariantsForProduct(productUuid: string): Promise<ProductVariant[]> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/" + productUuid + "/variants"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: ProductVariant[] = (<ProductVariant[]>res.json()).map(o => new ProductVariant().deserialize(o));
                resolve(list);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }
}

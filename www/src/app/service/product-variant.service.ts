import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { ProductVariant } from "../model/product-variant";

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
}

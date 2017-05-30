import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { Product } from "../model/product";

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
}

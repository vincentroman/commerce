import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { Customer } from "../model/customer";

@Injectable()
export class CustomerService extends CrudService<Customer> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): Customer {
        return new Customer();
    }

    protected getPath(): string {
        return "customer";
    }
}

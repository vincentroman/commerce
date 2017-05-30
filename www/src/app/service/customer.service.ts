import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";

import { SessionService } from "./session.service";
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

import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";

import { SessionService } from "./session.service";
import { HttpService } from "./http.service";

import { Broker } from "../model/broker";
import { CrudService } from "./crud.service";

@Injectable()
export class BrokerService extends CrudService<Broker> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): Broker {
        return new Broker();
    }

    protected getPath(): string {
        return "broker";
    }
}

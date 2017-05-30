import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { Broker } from "../model/broker";

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

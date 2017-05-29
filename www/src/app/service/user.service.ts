import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";

import { HttpService } from "./http.service";

import { User } from "../model/user";
import { CrudService } from "./crud.service";

@Injectable()
export class UserService extends CrudService<User> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): User {
        return new User();
    }

    protected getPath(): string {
        return "user";
    }

    me(): Promise<User> {
        return this.http
            .get(this.httpService.getUrl(this.getPath() + "/me"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let user = this.newTypeInstance().deserialize(res.json());
                return user;
            })
            .catch(error => {
                throw this.httpService.handleError(error);
            });
    }
}

import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { User } from "../model/user";

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

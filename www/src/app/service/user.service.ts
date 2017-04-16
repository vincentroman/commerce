import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";

import { SessionService } from "./session.service";
import { HttpService } from "./http.service";

import { User } from "../model/user";

@Injectable()
export class UserService {
    constructor(
        private sessionService: SessionService,
        private httpService: HttpService,
        private http: Http
    ) {}

    list(): Promise<User[]> {
        return this.http
            .get(this.httpService.getUrl("user/list"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: User[] = (<User[]>res.json()).map(o => new User().deserialize(o));
                return list;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    get(id: string): Promise<User> {
        return this.http
            .get(this.httpService.getUrl("user/get/" + id), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let user = new User().deserialize(<User>res.json());
                return user;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    save(user: User): Promise<User> {
        return this.http.post(this.httpService.getUrl("user/set"), user.serialize(), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let user = new User().deserialize(<User>res.json());
                return user;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    delete(id: string): Promise<void> {
        return this.http.delete(this.httpService.getUrl("user/delete/" + id), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }
}

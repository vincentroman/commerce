import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";

import { HttpService } from "./http.service";
import { SessionService } from "./session.service";
import { User } from "../model/user";

import "rxjs/add/operator/toPromise";

@Injectable()
export class AuthService {
    constructor(
        private router: Router,
        private http: Http,
        private sessionService: SessionService,
        private httpService: HttpService
    ) {}

    login(email: string, password: string): Promise<User> {
        let payload: any = {
            email: email,
            password: password
        };
        return this.http.post(this.httpService.getUrl("auth/login"), payload, this.httpService.getOptions())
                .toPromise()
                .then(res => {
                    this.sessionService.saveJwt(res.text());
                    this.http.get(this.httpService.getUrl("user/me"), this.httpService.getOptions())
                    .toPromise()
                    .then((res) => {
                        console.log(res);
                    })
                    .catch();
                    let user: User = new User();
                    return user;
                })
                .catch(error => {
                    return this.httpService.handleError(error);
                });
    }
}

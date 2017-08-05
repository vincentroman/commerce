import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";

import { HttpService } from "./http.service";
import { SessionService } from "./session.service";
import { User } from "../model/user";

import "rxjs/add/operator/toPromise";
import { UserService } from "./user.service";

@Injectable()
export class AuthService {
    constructor(
        private router: Router,
        private http: Http,
        private sessionService: SessionService,
        private userService: UserService,
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
                    return this.userService.me()
                    .then(user => {
                        this.sessionService.saveUser(user);
                        return user;
                    })
                    .catch();
                })
                .catch(error => {
                    throw this.httpService.handleError(error);
                });
    }

    resetPassword(email: string): Promise<void> {
        let payload: any = {
            email: email
        };
        return this.http.post(this.httpService.getUrl("auth/pwreset"), payload, this.httpService.getOptions())
                .toPromise()
                .then(res => { return; })
                .catch(error => {
                    throw this.httpService.handleError(error);
                });
    }

    changePassword(actionUuid: string, password: string): Promise<void> {
        let payload: any = {
            uuid: actionUuid,
            password: password
        };
        return this.http.post(this.httpService.getUrl("auth/pwchange"), payload, this.httpService.getOptions())
                .toPromise()
                .then(res => { return; })
                .catch(error => {
                    throw this.httpService.handleError(error);
                });
    }
}

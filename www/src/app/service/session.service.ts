import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "../model/user";

import "rxjs/add/operator/toPromise";

@Injectable()
export class SessionService {
    isLoggedIn: boolean = false;
    jwt: string = "";
    user: User = new User();

    constructor(
        private router: Router
    ) {
        let jwt = this.getJwt();
        if (jwt) {
            this.jwt = jwt;
            this.isLoggedIn = true;
            this.parseJwt();
        }
    }

    saveJwt(jwt: string): void {
        sessionStorage.setItem("jwt", jwt);
        this.jwt = jwt;
        this.parseJwt();
        this.isLoggedIn = true;
    }

    logout(): boolean {
        sessionStorage.removeItem("jwt");
        this.isLoggedIn = false;
        this.router.navigate(["/login"]);
        return false;
    }

    getJwt(): string {
        return sessionStorage.getItem("jwt");
    }

    hasRole(role: string): boolean {
        /*
        for (let i=0; i<this.user.roles.length; i++) {
            if (this.user.roles[i] == role) {
                return true;
            }
        }
        */
        return false;
    }

    private parseJwt(): void {
        let tokens: string[] = this.jwt.split(".");
        let decoded = window.atob(tokens[1]);
        let payload = JSON.parse(decoded);
        this.user.id = payload.id;
        /*
        this.user.username = payload.username;
        this.user.roles = payload.roles.split(",");
        if (payload.customerId) {
            this.customerId = payload.customerId;
        }
        */
    }
}

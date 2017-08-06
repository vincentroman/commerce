import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import "rxjs/add/operator/toPromise";
import { Person } from "../model/person";

@Injectable()
export class SessionService {
    isLoggedIn: boolean = false;
    jwt: string = "";
    user: Person = new Person();

    constructor(
        private router: Router
    ) {
        let jwt = sessionStorage.getItem("jwt");
        if (jwt) {
            this.jwt = jwt;
            this.isLoggedIn = true;
            let userSerialized = sessionStorage.getItem("user");
            if (userSerialized) {
                this.user = new Person().deserialize(JSON.parse(userSerialized));
            }
        }
    }

    saveJwt(jwt: string): void {
        sessionStorage.setItem("jwt", jwt);
        this.jwt = jwt;
        this.isLoggedIn = true;
    }

    saveUser(user: Person): void {
        sessionStorage.setItem("user", JSON.stringify(user.serialize()));
        this.user = user;
    }

    logout(): boolean {
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("user");
        this.isLoggedIn = false;
        this.jwt = "";
        this.user = new Person();
        this.router.navigate(["/login"]);
        return false;
    }
}

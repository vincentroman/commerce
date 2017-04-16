import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../service/auth.service";

@Component({
    templateUrl: "./login.component.html",
    providers: [
    ]
})
export class LoginComponent {
    model: any = {
        email: "",
        password: ""
    };
    loginError: boolean = false;
    submitting: boolean = false;

    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    submit(): void {
        this.loginError = false;
        this.submitting = true;
        this.authService.login(this.model.email, this.model.password)
            .then(res => {
                console.log(res);
            })
            .catch(res => {
                console.log(res);
            });
    }
}

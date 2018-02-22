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
            .then(person => {
                if (person.needDataVerification) {
                    this.router.navigate(["/profile/verify"]);
                } else {
                    this.router.navigate(["/home"]);
                }
            })
            .catch(res => {
                this.loginError = true;
                this.submitting = false;
            });
    }
}

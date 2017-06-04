import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../service/auth.service";

@Component({
    templateUrl: "./reset-password.component.html",
    providers: [
    ]
})
export class ResetPasswordComponent {
    model: any = {
        email: ""
    };
    submitting: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    submit(): void {
        this.submitting = true;
        this.success = false;
        this.authService.resetPassword(this.model.email)
            .then(entity => {
                this.submitting = false;
                this.success = true;
            }).catch(e => {
                this.submitting = false;
                this.error = true;
            });
    }
}

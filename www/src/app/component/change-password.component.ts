import { Component, Input, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthService } from "../service/auth.service";

@Component({
    templateUrl: "./change-password.component.html",
    providers: [
    ]
})
export class ChangePasswordComponent implements OnInit {
    uuid: string = "";
    model: any = {
        password: ""
    };
    submitting: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let uuid: string = params["uuid"];
            if (uuid) {
                this.uuid = uuid;
            }
        });
    }

    submit(): void {
        this.submitting = true;
        this.success = false;
        this.authService.changePassword(this.uuid, this.model.password)
            .then(entity => {
                this.submitting = false;
                this.success = true;
            }).catch(e => {
                this.submitting = false;
                this.error = true;
            });
    }
}

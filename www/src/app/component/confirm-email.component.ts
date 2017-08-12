import { Component, Input, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthService } from "../service/auth.service";

@Component({
    templateUrl: "./confirm-email.component.html",
    providers: [
    ]
})
export class ConfirmEmailComponent implements OnInit {
    loading: boolean = true;
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
                this.authService.emailConfirm(uuid)
                .then(() => {
                    this.loading = false;
                    this.error = false;
                }).catch(e => {
                    this.loading = false;
                    this.error = true;
                });
            }
        });
    }
}

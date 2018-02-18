import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../service/auth.service";
import { Person } from "../model/person";
import { PersonService } from "../service/person.service";
import { SystemSettingService } from "../service/systemsetting.service";

@Component({
    templateUrl: "./profile.component.html",
    providers: [
    ]
})
export class ProfileComponent implements OnInit {
    entity: Person = new Person();
    changeEmail: boolean = false;
    changePassword: boolean = false;
    originalEmail: string = "";
    submitting: boolean = false;
    success: boolean = false;
    error: boolean = false;
    siteContactUrl: string = "";

    constructor(
        private router: Router,
        private personService: PersonService,
        private settingsService: SystemSettingService
    ) {}

    ngOnInit(): void {
        this.personService.me().then(person => {
            this.entity = person;
            this.originalEmail = person.email;
        });
        this.settingsService.getPublicSettings().then(settings => {
            if (settings.siteContactUrl) {
                this.siteContactUrl = settings.siteContactUrl;
            }
        });
    }

    submit(): void {
        this.submitting = true;
        this.success = false;
        if (!this.changePassword) {
            this.entity.password = "";
        }
        if (!this.changeEmail) {
            this.entity.email = this.originalEmail;
        }
        this.personService.updateMe(this.entity).then(person => {
            this.entity = person;
            this.submitting = false;
            this.success = true;
        });
    }
}

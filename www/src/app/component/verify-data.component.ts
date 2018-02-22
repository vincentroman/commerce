import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PersonService } from "../service/person.service";
import { SessionService } from "../service/session.service";

@Component({
    templateUrl: "./verify-data.component.html",
    providers: [
        PersonService
    ]
})
export class VerifyDataComponent {
    submitting: boolean = false;
    session: SessionService;

    constructor(
        private router: Router,
        private personService: PersonService,
        private sessionService: SessionService
    ) {
        this.session = sessionService;
    }

    submit(): void {
        this.submitting = true;
        this.personService.confirmMyData().then(() => {
            this.router.navigate(["/home"]);
        });
    }
}

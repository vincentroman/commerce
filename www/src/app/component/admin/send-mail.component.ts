import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { PersonService } from "../../service/person.service";
import { Person } from "../../model/person";

@Component({
    templateUrl: "./send-mail.component.html",
    providers: [
        PersonService
    ]
})
export class SendMailComponent {
    uuid: string = "";
    user: Person = null;
    submitting: boolean = false;
    error: boolean = false;
    success: boolean = false;
    model = {
        subject: "",
        body: ""
    };

    constructor(
        protected route: ActivatedRoute,
        private personService: PersonService
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let uuid: string = params["uuid"];
            if (uuid) {
                this.uuid = uuid;
                this.personService.get(uuid).then(user => {
                    this.user = user;
                })
            }
        });
    }

    submit(): void {
        if (this.uuid) {
            if (confirm("Really send this email to " + this.user.printableName() + "?")) {
                this.submitting = true;
                this.error = false;
                this.success = false;
                this.personService.sendMailToUser(this.uuid, this.model.subject, this.model.body)
                    .then(() => {
                        this.error = false;
                        this.success = true;
                    });
            }
        } else {
            if (confirm("Really send this email to ALL users?")) {
                this.submitting = true;
                this.error = false;
                this.success = false;
                this.personService.sendMailToAllUsers(this.model.subject, this.model.body)
                    .then(() => {
                        this.error = false;
                        this.success = true;
                    });
            }
        }
    }
}

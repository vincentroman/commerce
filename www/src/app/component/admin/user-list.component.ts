import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "../entity-list.component";
import { PersonService } from "../../service/person.service";
import { Person } from "../../model/person";

@Component({
    templateUrl: "./user-list.component.html",
    providers: [
        PersonService
    ]
})
export class UserListComponent extends EntityListComponent<Person> {
    constructor(
        protected router: Router,
        protected personService: PersonService
    ) {
        super(router, personService);
    }

    protected getEditPath(): string {
        return "/admin/users/edit";
    }
}

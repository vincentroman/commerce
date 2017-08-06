import { Component, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "../entity-edit.component";
import { PersonService } from "../../service/person.service";
import { Person } from "../../model/person";
import { Comment } from "../../model/comment";

@Component({
    templateUrl: "./user-edit.component.html",
    providers: [
        PersonService
    ]
})
export class UserEditComponent extends EntityEditComponent<Person> {
    changePassword: boolean = false;
    comments: Comment[] = [];
    commentAdded: boolean = false;
    model = {
        text: ""
    };

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected personService: PersonService
    ) {
        super(route, router, personService);
    }

    protected newTypeInstance(): Person {
        return new Person();
    }

    protected getListPath(): string {
        return "/admin/users";
    }

    submit(): void {
        if (this.uuid && !this.changePassword) {
            this.entity.password = "";
        }
        super.submit();
    }

    protected onInit(): void {
        if (this.uuid) {
            this.personService.getComments(this.uuid).then(comments => this.comments = comments);
        }
    }

    addComment(): void {
        this.submitting = true;
        this.commentAdded = false;
        this.personService.addComment(this.uuid, this.model.text)
            .then(comment => {
                this.personService.getComments(this.uuid).then(comments => {
                    this.comments = comments;
                    this.model.text = "";
                    this.commentAdded = true;
                    this.submitting = false;
                });
            });
    }
}

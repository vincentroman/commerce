import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "../entity-list.component";
import { UserService } from "../../service/user.service";
import { User } from "../../model/user";

@Component({
    templateUrl: "./user-list.component.html",
    providers: [
        UserService
    ]
})
export class UserListComponent extends EntityListComponent<User> {
    constructor(
        protected router: Router,
        protected userService: UserService
    ) {
        super(router, userService);
    }

    protected getEditPath(): string {
        return "/admin/users/edit";
    }
}

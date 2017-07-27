import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "../entity-edit.component";
import { User } from "../../model/user";
import { UserService } from "../../service/user.service";

@Component({
    templateUrl: "./user-edit.component.html",
    providers: [
        UserService
    ]
})
export class UserEditComponent extends EntityEditComponent<User> {
    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected userService: UserService
    ) {
        super(route, router, userService);
    }

    protected newTypeInstance(): User {
        return new User();
    }

    protected getListPath(): string {
        return "/admin/users";
    }
}

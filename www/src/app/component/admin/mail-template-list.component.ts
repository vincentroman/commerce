import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "../entity-list.component";
import { MailTemplateService } from "../../service/mail-template.service";
import { MailTemplate } from "../../model/mail-template";

@Component({
    templateUrl: "./mail-template-list.component.html",
    providers: [
        MailTemplateService
    ]
})
export class MailTemplateListComponent extends EntityListComponent<MailTemplate> {
    constructor(
        protected router: Router,
        protected mailTemplateService: MailTemplateService
    ) {
        super(router, mailTemplateService);
    }

    protected getEditPath(): string {
        return "/admin/mailtemplates/edit";
    }
}

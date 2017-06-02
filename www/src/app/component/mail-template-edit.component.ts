import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "./entity-edit.component";
import { MailTemplate } from "../model/mail-template";
import { MailTemplateService } from "../service/mail-template.service";

@Component({
    templateUrl: "./mail-template-edit.component.html",
    providers: [
        MailTemplateService
    ]
})
export class MailTemplateEditComponent extends EntityEditComponent<MailTemplate> {
    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected mailTemplateService: MailTemplateService
    ) {
        super(route, router, mailTemplateService);
    }

    protected newTypeInstance(): MailTemplate {
        return new MailTemplate();
    }

    protected getListPath(): string {
        return "/mailtemplates";
    }
}

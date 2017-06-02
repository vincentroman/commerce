import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { MailTemplate } from "../model/mail-template";

@Injectable()
export class MailTemplateService extends CrudService<MailTemplate> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): MailTemplate {
        return new MailTemplate();
    }

    protected getPath(): string {
        return "mailtemplate";
    }
}

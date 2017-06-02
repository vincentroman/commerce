import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";
import { MailTemplate } from "../entity/MailTemplate";
import { MailTemplateDao } from "../dao/MailTemplateDao";

class MailTemplateRouter extends CrudRouter<MailTemplate, MailTemplateDao> {
    protected getDao(): MailTemplateDao {
        return Container.get(MailTemplateDao);
    }
    protected createEntity(requestBody: any): Promise<MailTemplate> {
        return new Promise((resolve, reject) => {
            resolve(new MailTemplate(requestBody));
        });
    }
}

export default new MailTemplateRouter().router;

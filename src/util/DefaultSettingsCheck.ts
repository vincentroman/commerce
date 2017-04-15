import { MailTemplateDao } from "../dao/MailTemplateDao";
import { Container } from "typedi";
import { MailTemplate, MailTemplateType } from "../entity/MailTemplate";

export class DefaultSettingsCheck {
    public static async check(): Promise<void> {
        await DefaultSettingsCheck.checkMailTemplates();
    }

    private static async checkMailTemplates(): Promise<void> {
        let dao: MailTemplateDao = Container.get(MailTemplateDao);
        let template: MailTemplate;

        // New Account
        template = await dao.getByType(MailTemplateType.NewAccount);
        if (template === undefined || template == null) {
            template = new MailTemplate();
            template.type = MailTemplateType.NewAccount;
            template.subject = "";
            template.body = "";
            await dao.save(template);
        }

        // License Key
        template = await dao.getByType(MailTemplateType.PurchaseLicenseKey);
        if (template === undefined || template == null) {
            template = new MailTemplate();
            template.type = MailTemplateType.PurchaseLicenseKey;
            template.subject = "";
            template.body = "";
            await dao.save(template);
        }

        // Support Ticket
        template = await dao.getByType(MailTemplateType.PurchaseSupportTicket);
        if (template === undefined || template == null) {
            template = new MailTemplate();
            template.type = MailTemplateType.PurchaseSupportTicket;
            template.subject = "";
            template.body = "";
            await dao.save(template);
        }

        // Eval
        template = await dao.getByType(MailTemplateType.DownloadEval);
        if (template === undefined || template == null) {
            template = new MailTemplate();
            template.type = MailTemplateType.DownloadEval;
            template.subject = "";
            template.body = "";
            await dao.save(template);
        }
    }
}

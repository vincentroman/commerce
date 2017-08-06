import { MailTemplateDao } from "../dao/MailTemplateDao";
import { Container } from "typedi";
import { MailTemplate, MailTemplateType } from "../entity/MailTemplate";
import { SystemSettingId, SystemSettingType } from "../entity/SystemSetting";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { PersonDao } from "../dao/PersonDao";
import { Person } from "../entity/Person";

export class DefaultSettingsCheck {
    public static async check(): Promise<void> {
        await DefaultSettingsCheck.checkAdminUser();
        await DefaultSettingsCheck.checkMailTemplates();
        await DefaultSettingsCheck.checkSystemSettings();
    }

    private static async checkAdminUser(): Promise<void> {
        let dao: PersonDao = Container.get(PersonDao);
        let users: Person[] = await dao.getAdmins();
        if (users.length === 0) {
            let user: Person = new Person();
            user.firstname = "System";
            user.lastname = "Administrator";
            user.email = "admin@admin.local";
            user.setPlainPassword("admin");
            user.roleAdmin = true;
            user.roleCustomer = false;
            await dao.save(user);
        }
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

        // Reset Password
        template = await dao.getByType(MailTemplateType.ResetPassword);
        if (template === undefined || template == null) {
            template = new MailTemplate();
            template.type = MailTemplateType.ResetPassword;
            template.subject = "Reset your password";
            template.body = "Dear {{firstname}} {{lastname}},\n\n" +
                "you've requested a password reset on our website.\n\n" +
                "Please follow this link to choose a new password:\n\n" +
                "{{siteUrl}}/pwchange/{{uuid}}\n\n" +
                "If you did not initiate this password reset request, don't worry. " +
                "Your password won't change unless you use the link above.";
            await dao.save(template);
        }
    }

    private static async checkSystemSettings(): Promise<void> {
        let dao: SystemSettingDao = Container.get(SystemSettingDao);
        dao.createIfNotExists(SystemSettingId.MailServer_Host, SystemSettingType.String, "localhost", "SMTP Server");
        dao.createIfNotExists(SystemSettingId.MailServer_Port, SystemSettingType.Integer, "25", "SMTP Port");
        dao.createIfNotExists(SystemSettingId.MailServer_Secure, SystemSettingType.Boolean, "0", "SMTP Secure");
        dao.createIfNotExists(SystemSettingId.MailServer_Auth, SystemSettingType.Boolean, "0", "SMTP Auth");
        dao.createIfNotExists(SystemSettingId.MailServer_User, SystemSettingType.String, "", "SMTP Username");
        dao.createIfNotExists(SystemSettingId.MailServer_Pass, SystemSettingType.String, "", "SMTP Password");
        dao.createIfNotExists(SystemSettingId.MailServer_LogAndDiscard, SystemSettingType.Boolean, "1", "SMTP Log and Discard");
        dao.createIfNotExists(SystemSettingId.MailServer_Sender_Name, SystemSettingType.String, "Your Company Ltd.", "SMTP Sender Name");
        dao.createIfNotExists(SystemSettingId.MailServer_Sender_Email, SystemSettingType.String, "your@company.local", "SMTP Sender Email");
        dao.createIfNotExists(SystemSettingId.Site_Url, SystemSettingType.String, "http://localhost:3001", "Site URL");
        dao.createIfNotExists(SystemSettingId.LicenseKey_PrivateKey, SystemSettingType.MultiLine,
            "", "RSA Private Key for License Key Encoding");
        dao.createIfNotExists(SystemSettingId.LicenseKey_PublicKey, SystemSettingType.MultiLine,
            "", "RSA Public Key for License Key Encoding");
    }
}

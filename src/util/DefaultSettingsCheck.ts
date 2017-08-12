import * as fs from "fs";
import { MailTemplateDao } from "../dao/MailTemplateDao";
import { Container } from "typedi";
import { MailTemplate, MailTemplateType } from "../entity/MailTemplate";
import { SystemSettingId, SystemSettingType } from "../entity/SystemSetting";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { PersonDao } from "../dao/PersonDao";
import { Person } from "../entity/Person";
import { TopLevelDomainDao } from "../dao/TopLevelDomainDao";
import { Config } from "./Config";

export class DefaultSettingsCheck {
    public static async check(): Promise<void> {
        await DefaultSettingsCheck.checkAdminUser();
        await DefaultSettingsCheck.checkMailTemplates();
        await DefaultSettingsCheck.checkSystemSettings();
        await DefaultSettingsCheck.checkTopLevelDomains();
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

        // Change Email
        template = await dao.getByType(MailTemplateType.ChangeEmail);
        if (template === undefined || template == null) {
            template = new MailTemplate();
            template.type = MailTemplateType.ChangeEmail;
            template.subject = "Confirm your email address";
            template.body = "Dear {{firstname}} {{lastname}},\n\n" +
                "you've requested a change of your email address on our website.\n\n" +
                "Please follow this link to confirm this address:\n\n" +
                "{{siteUrl}}/emailconfirm/{{uuid}}\n\n" +
                "If you did not initiate this email change request, don't worry. " +
                "Your email address won't change unless you use the link above.";
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
        dao.createIfNotExists(SystemSettingId.NumDays_About_To_Expire, SystemSettingType.Integer, "20",
            "Days before license key is considered nearly expired");
        dao.createIfNotExists(SystemSettingId.LicenseKey_PrivateKey, SystemSettingType.MultiLine,
            "", "RSA Private Key for License Key Encoding");
        dao.createIfNotExists(SystemSettingId.LicenseKey_PublicKey, SystemSettingType.MultiLine,
            "", "RSA Public Key for License Key Encoding");
        dao.createIfNotExists(SystemSettingId.Tld_List_Version, SystemSettingType.Integer, "0", "TLD List Version", true);
    }

    private static async checkTopLevelDomains(): Promise<void> {
        let importTldListOnStart: boolean = Boolean(Config.getInstance().get("importTldListOnStart"));
        if (!importTldListOnStart) {
            console.log("Skipping to import top level domain list.");
            return;
        }
        let systemSettingDao: SystemSettingDao = Container.get(SystemSettingDao);
        let data: TldData = JSON.parse(fs.readFileSync(__dirname + "/../../res/tld.json", "utf8"));
        let currentListVersion = await systemSettingDao.getInteger(SystemSettingId.Tld_List_Version, 0);
        if (data.version > currentListVersion) {
            console.log("Updating top level domain list to version %d (this might take a while)...", data.version);
            let dao: TopLevelDomainDao = Container.get(TopLevelDomainDao);
            for (let item of data.items) {
                await dao.insertIfNotExists(item.tld);
            }
            await systemSettingDao.updateSetting(SystemSettingId.Tld_List_Version, String(data.version));
        } else {
            console.log("Not updating top level domain list (source is version %d, already at version %d)",
                data.version, currentListVersion);
        }
    }
}

declare class TldData {
    version: number;
    items: TldItem[];
}

declare class TldItem {
    tld: string;
}

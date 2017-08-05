import * as nodemailer from 'nodemailer';
import { MailTemplate } from "../entity/MailTemplate";
import { Customer } from "../entity/Customer";
import { Container } from "typedi";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { SystemSettingId } from "../entity/SystemSetting";

export class Email {
    public static async send(options: EmailOptions): Promise<void> {
        let logAndDiscard = await Container.get(SystemSettingDao).getBoolean(SystemSettingId.MailServer_LogAndDiscard, false);
        let mailConfig = await Email.getTransportConfig();
        let transporter = nodemailer.createTransport(mailConfig);
        let mailOptions = {
            from: (options.sender.name ? options.sender.name + " <"+options.sender.email+">" : options.sender.email),
            to:  (options.recipient.name ? options.recipient.name + " <"+options.recipient.email+">" : options.recipient.email),
            subject: options.subject,
            text: options.text,
            html: options.html
        };
        return new Promise<void>((resolve, reject) => {
            if (logAndDiscard) {
                console.log("Would send email: %s", JSON.stringify(mailOptions, undefined, 2));
                resolve();
                return;
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public static async sendByTemplate(template: MailTemplate, recipient: Address, params: any): Promise<void> {
        let renderedSubject: string = Email.renderParamString(template.subject, params);
        let renderedTemplate: string = Email.renderParamString(template.body, params);
        let options: EmailOptions = {
            recipient: recipient,
            sender: {
                name: await Container.get(SystemSettingDao).getString(SystemSettingId.MailServer_Sender_Name, ""),
                email: await Container.get(SystemSettingDao).getString(SystemSettingId.MailServer_Sender_Email, "")
            },
            subject: renderedSubject,
            text: renderedTemplate
        };
        return Email.send(options);
    }

    public static renderParamString(s: string, params: any): string {
        let result = s;
        Object.keys(params).map((key) => {
            result = result.replace("{"+key+"}", params[key]);
        });
        return result;
    }

    private static async getTransportConfig(): Promise<Object> {
        let dao = Container.get(SystemSettingDao);
        let config = {
            host: await dao.getString(SystemSettingId.MailServer_Host, "localhost"),
            port: await dao.getInteger(SystemSettingId.MailServer_Port, 25),
            secure: await dao.getBoolean(SystemSettingId.MailServer_Secure, false)
        };
        let auth = await dao.getBoolean(SystemSettingId.MailServer_Auth, false);
        if (auth) {
            config['auth'] = {
                user: await dao.getString(SystemSettingId.MailServer_User, ""),
                pass: await dao.getString(SystemSettingId.MailServer_Pass, "")
            };
        }
        return config;
    }
}

export declare class Address {
    name?: string;
    email: string;
}

export declare class EmailOptions {
    recipient: Address;
    sender: Address;
    subject: string;
    text: string;
    html?: string;
}

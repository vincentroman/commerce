import * as nodemailer from 'nodemailer';
import { Config } from "../util/Config";
import { MailTemplate } from "../entity/MailTemplate";
import { Customer } from "../entity/Customer";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";

export class Email {
    public static send(options: EmailOptions): Promise<void> {
        let mailConfig = Config.getInstance().get("mail");
        return new Promise<void>((resolve, reject) => {
            let transporter = nodemailer.createTransport(mailConfig);
            let mailOptions = {
                from: (options.sender.name ? options.sender.name + " <"+options.sender.email+">" : options.sender.email),
                to:  (options.recipient.name ? options.recipient.name + " <"+options.recipient.email+">" : options.recipient.email),
                subject: options.subject,
                text: options.text,
                html: options.html
            };
            if (mailConfig.logAndDiscard) {
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

    public static sendByTemplate(template: MailTemplate, recipient: Address, params: any): Promise<void> {
        let mailConfig = Config.getInstance().get("mail");
        let renderedSubject: string = Email.renderParamString(template.subject, params);
        let renderedTemplate: string = Email.renderParamString(template.body, params);
        let options: EmailOptions = {
            recipient: recipient,
            sender: {
                name: mailConfig.sender.name,
                email: mailConfig.sender.email
            },
            subject: renderedSubject,
            text: renderedTemplate
        };
        return Email.send(options);
    }

    public static renderParamString(s: string, params: any): string {
        let result = s;
        for (let key in params) {
            result = result.replace("{"+key+"}", params[key]);
        }
        return result;
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

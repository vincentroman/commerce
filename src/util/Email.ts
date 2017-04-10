import * as nodemailer from 'nodemailer';
import { Config } from "../util/Config";

export class Email {
    public static send(options: EmailOptions): Promise<void> {
        let mailConfig = Config.getInstance().get("mail");
        return new Promise<void>((resolve, reject) => {
            let transporter = nodemailer.createTransport(mailConfig);
            let mailOptions = {
                from: (options.senderName ? options.senderName + " <"+options.senderEmail+">" : options.senderEmail),
                to:  (options.recipientName ? options.recipientName + " <"+options.recipientEmail+">" : options.recipientEmail),
                subject: options.subject,
                text: options.text,
                html: options.html
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

export declare class EmailOptions {
    recipientEmail: string;
    recipientName?: string;
    senderEmail: string;
    senderName?: string;
    subject: string;
    text: string;
    html?: string;
}

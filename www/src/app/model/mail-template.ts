import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";

export class MailTemplate extends RestModel implements Serializable<MailTemplate> {
    type: MailTemplateType;
    subject: string;
    body: string;

    serialize(): Object {
        return {
            "uuid": this.uuid,
            "type": this.type,
            "subject": this.subject,
            "body": this.body
        };
    }

    deserialize(input: any): MailTemplate {
        this.uuid = input.uuid;
        this.type = input.type;
        this.subject = input.subject;
        this.body = input.body;
        return this;
    }

    getPrintableType(): string {
        switch (this.type) {
            case MailTemplateType.NewAccount:
                return "New Account";
            case MailTemplateType.PurchaseLicenseKey:
                return "Purchase License Key";
            case MailTemplateType.PurchaseSupportTicket:
                return "Purchase Support Ticket";
            case MailTemplateType.DownloadEval:
                return "Download Evaluation";
            case MailTemplateType.ResetPassword:
                return "Reset Password";
            default:
                return "Unknown";
        }
    }
}

export enum MailTemplateType {
    NewAccount = 1,
    PurchaseLicenseKey = 2,
    PurchaseSupportTicket = 3,
    DownloadEval = 4,
    ResetPassword = 5
}

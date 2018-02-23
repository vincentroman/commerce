import { RestModel } from "./rest-model";

export class MailTemplate extends RestModel<MailTemplate> {
    type: MailTemplateType;
    subject: string;
    body: string;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            "type": this.type,
            "subject": this.subject,
            "body": this.body
        });
    }

    deserialize(input: any): MailTemplate {
        this._deserialize(input);
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
            case MailTemplateType.ChangeEmail:
                return "Confirm Email Address";
            case MailTemplateType.EvalBuyReminder:
                return "Reminder to buy";
            case MailTemplateType.LicenseExpiryReminder:
                return "Reminder to renew license";
            case MailTemplateType.ConfirmOrder:
                return "Confirm order";
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
    ResetPassword = 5,
    ChangeEmail = 6,
    EvalBuyReminder = 7,
    LicenseExpiryReminder = 8,
    ConfirmOrder = 9
}

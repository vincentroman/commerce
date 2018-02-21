import { Entity, Column } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class MailTemplate extends DbEntity<MailTemplate> {
    @Column({unique: true})
    type: MailTemplateType;

    @Column()
    subject: string;

    @Column("text")
    body: string;

    public serialize(skipDeletedCheck?: boolean): Object {
        return Object.assign(super.serialize(skipDeletedCheck), {
            type: this.type,
            subject: this.subject,
            body: this.body
        });
    }

    public deserialize(o: Object): MailTemplate {
        this.type = o['type'];
        this.subject = o['subject'];
        this.body = o['body'];
        return this;
    }

    public isConsistent(): boolean {
        if (this.type) {
            return true;
        }
        return false;
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

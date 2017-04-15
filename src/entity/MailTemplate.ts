import { Entity, Column } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class MailTemplate extends DbEntity {
    @Column({unique: true})
    type: MailTemplateType;

    @Column()
    subject: string;

    @Column("text")
    body: string;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
        });
    }

    public  deserialize(o: Object): void {
        // TODO
    }
}

export enum MailTemplateType {
    NewAccount = 1,
    PurchaseLicenseKey = 2,
    PurchaseSupportTicket = 3,
    DownloadEval = 4
}

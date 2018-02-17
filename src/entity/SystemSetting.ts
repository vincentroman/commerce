import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class SystemSetting extends DbEntity<SystemSetting> {
    @Column({unique: true})
    settingId: SystemSettingId;

    @Column()
    description: string;

    @Column()
    type: SystemSettingType;

    @Column("text")
    value: string;

    @Column()
    internal: boolean = false;

    public serialize(skipDeletedCheck?: boolean): Object {
        return Object.assign(super.serialize(skipDeletedCheck), {
            id: this.settingId,
            description: this.description,
            type: this.type,
            value: this.value,
            internal: this.internal
        });
    }

    public deserialize(o: Object): SystemSetting {
        this.settingId = o['id'];
        this.description = o['description'];
        this.type = o['type'];
        this.value = o['value'];
        return this;
    }

    public isConsistent(): boolean {
        if (this.settingId &&
            this.type) {
            return true;
        }
        return false;
    }
}

export enum SystemSettingId {
    MailServer_Host = 1,
    MailServer_Port = 2,
    MailServer_Secure = 3,
    MailServer_Auth = 4,
    MailServer_User = 5,
    MailServer_Pass = 6,
    MailServer_LogAndDiscard = 7,
    MailServer_Sender_Name = 8,
    MailServer_Sender_Email = 9,
    Site_Url = 20,
    Site_Imprint_Url = 21,
    Site_PrivacyPolicy_Url = 22,
    Site_Contact_Url = 23,
    NumDays_About_To_Expire = 30,
    LicenseKey_PrivateKey = 50,
    LicenseKey_PublicKey = 51,
    LicenseKey_AutoIncludeDomains = 52,
    Tld_List_Version = 901
}

export enum SystemSettingType {
    String = 1,
    Integer = 2,
    MultiLine = 3,
    Boolean = 4
}

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

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            id: this.settingId,
            description: this.description,
            type: this.type,
            value: this.value
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
    LicenseKey_PrivateKey = 50,
    LicenseKey_PublicKey = 51
}

export enum SystemSettingType {
    String = 1,
    Integer = 2,
    MultiLine = 3
}

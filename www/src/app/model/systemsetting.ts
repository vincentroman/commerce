import { RestModel } from "./rest-model";

export class SystemSetting extends RestModel<SystemSetting> {
    settingId: number;
    description: string;
    type: SystemSettingType;
    value: string;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            "id": this.settingId,
            "type": this.type,
            "description": this.description,
            "value": this.value
        });
    }

    deserialize(input: any): SystemSetting {
        this._deserialize(input);
        this.settingId = input.id;
        this.type = input.type;
        this.description = input.description;
        this.value = input.value;
        return this;
    }
}

export enum SystemSettingType {
    String = 1,
    Integer = 2,
    MultiLine = 3,
    Boolean = 4
}

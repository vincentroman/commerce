import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";

export class SystemSetting extends RestModel implements Serializable<SystemSetting> {
    settingId: number;
    description: string;
    type: SystemSettingType;
    value: string;

    serialize(): Object {
        return {
            "uuid": this.uuid,
            "id": this.settingId,
            "type": this.type,
            "description": this.description,
            "value": this.value
        };
    }

    deserialize(input: any): SystemSetting {
        this.uuid = input.uuid;
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
    MultiLine = 3
}

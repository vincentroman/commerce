import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { SystemSetting, SystemSettingId, SystemSettingType } from "../entity/SystemSetting";

@Service()
export class SystemSettingDao extends Dao<SystemSetting> {
    protected getRepository(): Repository<SystemSetting> {
        return this.getEm().getRepository(SystemSetting);
    }

    public async getBySettingId(id: SystemSettingId): Promise<SystemSetting> {
        return this.getRepository().findOne({settingId: id});
    }

    public async createIfNotExists(id: SystemSettingId,
            type: SystemSettingType,
            value: string,
            description: string): Promise<SystemSetting> {
        return new Promise<SystemSetting>((resolve, reject) => {
            this.getBySettingId(id).then(setting => {
                if (setting) {
                    resolve(setting);
                } else {
                    setting = new SystemSetting();
                    setting.settingId = id;
                    setting.type = type;
                    setting.value = value;
                    setting.description = description;
                    this.save(setting).then(setting => {
                        resolve(setting);
                    });
                }
            });
        });
    }
}

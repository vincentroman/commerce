import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { SystemSetting, SystemSettingId, SystemSettingType } from "../entity/SystemSetting";

@Service()
export class SystemSettingDao extends Dao<SystemSetting> {
    protected getRepository(): Repository<SystemSetting> {
        return this.getEm().getRepository(SystemSetting);
    }

    protected allowPhysicalDelete(o: SystemSetting): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(true));
    }

    public async getAll(): Promise<SystemSetting[]> {
        return this.getRepository()
            .createQueryBuilder("ss")
            .where("ss.deleted != 1")
            .orderBy("ss.settingId", "ASC")
            .getMany();
    }

    public async getBySettingId(id: SystemSettingId): Promise<SystemSetting> {
        return this.getRepository().findOne({settingId: id});
    }

    public async getString(id: SystemSettingId, defaultValue: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.getBySettingId(id).then(setting => {
                if (setting) {
                    resolve(setting.value);
                } else {
                    resolve(defaultValue);
                }
            }).catch(e => resolve(defaultValue));
        });
    }

    public async getInteger(id: SystemSettingId, defaultValue: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.getBySettingId(id).then(setting => {
                if (setting) {
                    resolve(Number(setting.value));
                } else {
                    resolve(defaultValue);
                }
            }).catch(e => resolve(defaultValue));
        });
    }

    public async getBoolean(id: SystemSettingId, defaultValue: boolean): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getBySettingId(id).then(setting => {
                if (setting) {
                    let value = false;
                    if (setting.value && (setting.value === "1" || setting.value === "true")) {
                        value = true;
                    }
                    resolve(value);
                } else {
                    resolve(defaultValue);
                }
            }).catch(e => resolve(defaultValue));
        });
    }

    public async createIfNotExists(id: SystemSettingId,
            type: SystemSettingType,
            value: string,
            description: string,
            internal?: boolean): Promise<SystemSetting> {
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
                    setting.internal = (internal === undefined ? false : internal);
                    this.save(setting).then(setting => {
                        resolve(setting);
                    });
                }
            });
        });
    }

    public async updateSetting(id: SystemSettingId, value: string): Promise<SystemSetting> {
        return this.getBySettingId(id).then(setting => {
            setting.value = value;
            return this.save(setting);
        });
    }
}

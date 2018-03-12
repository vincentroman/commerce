import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { SystemSetting, SystemSettingId } from "../entity/SystemSetting";
import { AuthRole } from "./BaseRouter";
import { App } from '../App';

class SystemSettingRouter extends CrudRouter<SystemSetting, SystemSettingDao> {
    protected getDao(): SystemSettingDao {
        return Container.get(SystemSettingDao);
    }

    protected createEntity(requestBody: any): Promise<SystemSetting> {
        return new Promise((resolve, reject) => {
            resolve(new SystemSetting(requestBody));
        });
    }

    protected getDefaultAuthRole(): AuthRole {
        return AuthRole.ADMIN;
    }

    protected init(): void {
        super.init();
        this.addRouteGet('/version', this.getVersion, AuthRole.ANY);
        this.addRouteGet('/public', this.getPublicSettings, AuthRole.ANY);
    }

    private getVersion(req: Request, res: Response, next: NextFunction): void {
        res.type("txt").send(App.getInstance().version.toString());
    }

    private getPublicSettings(req: Request, res: Response, next: NextFunction): void {
        this.getDao().getAll().then(settings => {
            let result = {
                version: App.getInstance().version,
                siteImprintUrl: "",
                sitePrivacyPolicyUrl: "",
                siteContactUrl: "",
                siteTitle: "",
                logoUrl: ""
            };
            settings.forEach(setting => {
                if (setting.settingId === SystemSettingId.Site_Contact_Url) {
                    result.siteContactUrl = setting.value;
                } else if (setting.settingId === SystemSettingId.Site_Imprint_Url) {
                    result.siteImprintUrl = setting.value;
                } else if (setting.settingId === SystemSettingId.Site_PrivacyPolicy_Url) {
                    result.sitePrivacyPolicyUrl = setting.value;
                } else if (setting.settingId === SystemSettingId.Site_Title) {
                    result.siteTitle = setting.value;
                } else if (setting.settingId === SystemSettingId.Site_LogoUrl) {
                    result.logoUrl = setting.value;
                }
            });
            res.send(result);
        });
    }
}

export default new SystemSettingRouter().router;

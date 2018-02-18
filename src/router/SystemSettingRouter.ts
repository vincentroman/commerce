import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { SystemSetting } from "../entity/SystemSetting";
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
    }

    private getVersion(req: Request, res: Response, next: NextFunction): void {
        res.send(App.getInstance().version.toString());
    }
}

export default new SystemSettingRouter().router;

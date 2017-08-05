import * as jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter, AuthRole } from "./BaseRouter";
import { Config } from '../util/Config';
import { User } from '../entity/User';
import { UserDao } from '../dao/UserDao';
import { PendingActionDao } from "../dao/PendingActionDao";
import { PendingAction, ActionType } from "../entity/PendingAction";
import { MailTemplateDao } from "../dao/MailTemplateDao";
import { MailTemplateType } from "../entity/MailTemplate";
import { Email, Address } from "../util/Email";
import { JwtPayload } from "../util/JwtPayload";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { SystemSettingId } from "../entity/SystemSetting";

class AuthRouter extends BaseRouter {
    protected init(): void {
        this.addRoutePost('/login', this.login, AuthRole.GUEST);
        this.addRoutePost('/pwreset', this.resetPassword, AuthRole.GUEST);
        this.addRoutePost('/pwchange', this.changePassword, AuthRole.GUEST);
        this.addRoutePost('/logout', this.logout, AuthRole.USER);
    }

    private login(req: Request, res: Response, next: NextFunction): void {
        let userDao: UserDao = Container.get(UserDao);
        userDao.getByEmail(req.body.email).then((user) => {
            if (user.isPasswordValid(req.body.password)) {
                let jwt: string = this.createJwt(user);
                res.send(jwt);
            } else {
                this.notFound(res);
            }
        }).catch((e) => {
            this.notFound(res);
        });
    }

    private logout(req: Request, res: Response, next: NextFunction): void {
        this.ok(res);
    }

    private changePassword(req: Request, res: Response, next: NextFunction): void {
        let userDao: UserDao = Container.get(UserDao);
        let actionDao: PendingActionDao = Container.get(PendingActionDao);
        actionDao.getByUuid(req.body.uuid).then(action => {
            if (action && action.type === ActionType.ResetPassword) {
                let userId = action.getPayload().userId;
                userDao.getById(userId).then(user => {
                    if (user) {
                        user.setPlainPassword(req.body.password);
                        userDao.save(user).then(user => {
                            actionDao.delete(action).then(action => {
                                this.ok(res);
                            });
                        });
                    } else {
                        this.notFound(res);
                    }
                }).catch(e => this.internalServerError(res));
            } else {
                this.notFound(res);
            }
        }).catch(e => this.internalServerError(res));
    }

    private resetPassword(req: Request, res: Response, next: NextFunction): void {
        let userDao: UserDao = Container.get(UserDao);
        let actionDao: PendingActionDao = Container.get(PendingActionDao);
        let settingsDao: SystemSettingDao = Container.get(SystemSettingDao);
        let mailTemplateDao: MailTemplateDao = Container.get(MailTemplateDao);
        userDao.getByEmail(req.body.email).then((user) => {
            if (user && user.customer) {
                let action: PendingAction = new PendingAction();
                action.type = ActionType.ResetPassword;
                action.setPayload({
                    userId: user.id
                });
                actionDao.save(action).then(action => {
                    mailTemplateDao.getByType(MailTemplateType.ResetPassword).then(mailTemplate => {
                        settingsDao.getString(SystemSettingId.Site_Url, "").then(siteUrl => {
                            let params = {
                                firstname: (user.customer ? user.customer.firstname : "Unknown"),
                                lastname: (user.customer ? user.customer.lastname : "Unknown"),
                                uuid: action.uuid,
                                siteUrl: siteUrl
                            };
                            let recipient: Address = {
                                email: user.email
                            };
                            Email.sendByTemplate(mailTemplate, recipient, params);
                        });
                    });
                    this.ok(res);
                });
            } else {
                this.ok(res);
            }
        }).catch(e => this.ok(res));
    }

    private createJwt(user: User): string {
        let config = Config.getInstance().get("session");
        let payload: JwtPayload = {
            userId: user.uuid,
            customerId: (user.customer ? user.customer.uuid : ""),
            email: user.email
        };
        let options = {
            algorithm: 'HS256',
            expiresIn: config.lifetime,
            issuer: config.issuer
        };
        let token: string = jwt.sign(payload, config.secret, options);
        return token;
    }
}

export default new AuthRouter().router;

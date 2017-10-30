import * as jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter, AuthRole } from "./BaseRouter";
import { Config } from '../util/Config';
import { PendingActionDao } from "../dao/PendingActionDao";
import { PendingAction, ActionType } from "../entity/PendingAction";
import { MailTemplateDao } from "../dao/MailTemplateDao";
import { MailTemplateType } from "../entity/MailTemplate";
import { Email, Address } from "../util/Email";
import { JwtPayload } from "../util/JwtPayload";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { SystemSettingId } from "../entity/SystemSetting";
import { PersonDao } from "../dao/PersonDao";
import { Person } from "../entity/Person";

class AuthRouter extends BaseRouter {
    protected init(): void {
        this.addRoutePost('/login', this.login, AuthRole.GUEST);
        this.addRoutePost('/pwreset', this.resetPassword, AuthRole.GUEST);
        this.addRoutePost('/pwchange', this.changePassword, AuthRole.GUEST);
        this.addRoutePost('/emailconfirm', this.emailConfirm, AuthRole.ANY);
        this.addRoutePost('/logout', this.logout, AuthRole.USER);
    }

    private login(req: Request, res: Response, next: NextFunction): void {
        let dao: PersonDao = Container.get(PersonDao);
        dao.getByEmail(req.body.email).then((user) => {
            if (user) {
                if (user.isPasswordValid(req.body.password)) {
                    let jwt: string = this.createJwt(user);
                    res.send(jwt);
                } else {
                    console.log("Invalid login attempt for user %s (uuid = %s)", user.email, user.uuid);
                    this.notFound(res);
                }
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

    private emailConfirm(req: Request, res: Response, next: NextFunction): void {
        let dao: PersonDao = Container.get(PersonDao);
        let actionDao: PendingActionDao = Container.get(PendingActionDao);
        actionDao.getByUuid(req.body.uuid).then(action => {
            if (action && action.type === ActionType.ChangeEmail) {
                let userId = action.getPayload().userId;
                dao.getById(userId).then(user => {
                    if (user) {
                        user.email = action.getPayload().email;
                        dao.save(user).then(user => {
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

    private changePassword(req: Request, res: Response, next: NextFunction): void {
        let dao: PersonDao = Container.get(PersonDao);
        let actionDao: PendingActionDao = Container.get(PendingActionDao);
        actionDao.getByUuid(req.body.uuid).then(action => {
            if (action && action.type === ActionType.ResetPassword) {
                let userId = action.getPayload().userId;
                dao.getById(userId).then(user => {
                    if (user) {
                        user.setPlainPassword(req.body.password);
                        dao.save(user).then(user => {
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
        let dao: PersonDao = Container.get(PersonDao);
        let actionDao: PendingActionDao = Container.get(PendingActionDao);
        let settingsDao: SystemSettingDao = Container.get(SystemSettingDao);
        let mailTemplateDao: MailTemplateDao = Container.get(MailTemplateDao);
        dao.getByEmail(req.body.email).then((user) => {
            if (user) {
                let action: PendingAction = new PendingAction();
                action.type = ActionType.ResetPassword;
                action.setPayload({
                    userId: user.id
                });
                actionDao.save(action).then(action => {
                    mailTemplateDao.getByType(MailTemplateType.ResetPassword).then(mailTemplate => {
                        settingsDao.getString(SystemSettingId.Site_Url, "").then(siteUrl => {
                            let params = {
                                firstname: user.firstname,
                                lastname: user.lastname,
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

    private createJwt(user: Person): string {
        let config = Config.getInstance().get("session");
        let payload: JwtPayload = {
            userId: user.uuid,
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

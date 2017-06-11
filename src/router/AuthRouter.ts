import * as jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter } from "./BaseRouter";
import { Config } from '../util/Config';
import { User } from '../entity/User';
import { UserDao } from '../dao/UserDao';
import { PendingActionDao } from "../dao/PendingActionDao";
import { PendingAction, ActionType } from "../entity/PendingAction";
import { MailTemplateDao } from "../dao/MailTemplateDao";
import { MailTemplateType } from "../entity/MailTemplate";
import { Email, Address } from "../util/Email";
import { JwtPayload } from "../util/JwtPayload";

class AuthRouter extends BaseRouter {
    protected init(): void {
        this.addRoutePost('/login', this.login);
        this.addRoutePost('/pwreset', this.resetPassword);
        this.addRoutePost('/logout', this.logout, true);
    }

    private login(req: Request, res: Response, next: NextFunction): void {
        let userDao: UserDao = Container.get(UserDao);
        userDao.getByEmail(req.body.email).then((user) => {
            user.isPasswordValid(req.body.password).then((valid) => {
                if (!valid) {
                    this.notFound(res);
                    return;
                }
                let jwt: string = this.createJwt(user);
                res.send(jwt);
            });
        }).catch((e) => {
            this.notFound(res);
        });
    }

    private logout(req: Request, res: Response, next: NextFunction): void {
        this.ok(res);
    }

    private resetPassword(req: Request, res: Response, next: NextFunction): void {
        let userDao: UserDao = Container.get(UserDao);
        let actionDao: PendingActionDao = Container.get(PendingActionDao);
        let mailTemplateDao: MailTemplateDao = Container.get(MailTemplateDao);
        userDao.getByEmail(req.body.email).then((user) => {
            if (user.customer) {
                let action: PendingAction = new PendingAction();
                action.type = ActionType.ResetPassword;
                action.setPayload({
                    userId: user.id
                });
                actionDao.save(action).then(action => {
                    mailTemplateDao.getByType(MailTemplateType.ResetPassword).then(mailTemplate => {
                        let params = {
                            firstname: user.customer.firstname,
                            lastname: user.customer.lastname,
                            uuid: action.uuid
                        };
                        let recipient: Address = {
                            email: user.customer.email
                        };
                        Email.sendByTemplate(mailTemplate, recipient, params);
                    });
                });
            }
        });
        this.ok(res);
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

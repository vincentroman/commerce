import * as jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter } from "./BaseRouter";
import { Config } from '../util/Config';
import { User } from '../entity/User';
import { UserDao } from '../dao/UserDao';

class AuthRouter extends BaseRouter {
    protected init(): void {
        this.addRoutePost('/login', this.login);
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

    private createJwt(user: User): string {
        let config = Config.getInstance().get("session");
        let payload = {
            userId: user.uuid,
            email: user.email,
            roles: "",
            customerId: ""
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

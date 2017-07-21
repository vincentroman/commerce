import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { User } from '../entity/User';
import { UserDao } from '../dao/UserDao';
import { AuthRole } from "./BaseRouter";

class UserRouter extends CrudRouter<User, UserDao> {
    protected getDao(): UserDao {
        return Container.get(UserDao);
    }

    protected createEntity(requestBody: any): Promise<User> {
        return new Promise((resolve, reject) => {
            resolve(new User(requestBody));
        });
    }

    protected getDefaultAuthRole(): AuthRole {
        return AuthRole.ADMIN;
    }

    protected init(): void {
        super.init();
        this.addRouteGet('/me', this.me, AuthRole.USER);
    }

    private me(req: Request, res: Response, next: NextFunction): void {
        let uuid = this.getJwtUserUuid(req);
        let dao = Container.get(UserDao);
        dao.getByUuid(uuid).then((user) => {
            res.send(user.serialize());
        }).catch(e => this.notFound(res));
    }
}

export default new UserRouter().router;

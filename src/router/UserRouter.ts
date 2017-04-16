import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { User } from '../entity/User';
import { UserDao } from '../dao/UserDao';

class UserRouter extends CrudRouter<User, UserDao> {
    protected getDao(): UserDao {
        return Container.get(UserDao);
    }

    protected createEntity(requestBody: any): User {
        return new User(requestBody);
    }

    protected init(): void {
        super.init();
        this.addRouteGet('/me', this.me, true);
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

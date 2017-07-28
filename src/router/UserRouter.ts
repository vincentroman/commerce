import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { User } from '../entity/User';
import { UserDao } from '../dao/UserDao';
import { AuthRole } from "./BaseRouter";
import { CustomerDao } from "../dao/CustomerDao";

class UserRouter extends CrudRouter<User, UserDao> {
    protected getDao(): UserDao {
        return Container.get(UserDao);
    }

    protected createEntity(requestBody: any): Promise<User> {
        return new Promise((resolve, reject) => {
            let user: User = new User(requestBody);
            if (requestBody.customer) {
                Container.get(CustomerDao).getByUuid(requestBody.customer.uuid).then(customer => {
                    user.customer = customer;
                    resolve(user);
                });
            } else {
                resolve(user);
            }
        });
    }

    protected fixRelationsBeforeSave(entity: User): Promise<User> {
        return new Promise((resolve, reject) => {
            if (entity.customer && !entity.customer.id && entity.customer.uuid) {
                Container.get(CustomerDao).getByUuid(entity.customer.uuid).then(customer => {
                    entity.customer = customer;
                    resolve(entity);
                }).catch(e => reject(e));
            } else {
                resolve(entity);
            }
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

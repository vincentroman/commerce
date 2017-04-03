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
}

export default new UserRouter().router;

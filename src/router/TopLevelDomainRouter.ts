import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";
import { AuthRole } from "./BaseRouter";
import { TopLevelDomain } from "../entity/TopLevelDomain";
import { TopLevelDomainDao } from "../dao/TopLevelDomainDao";

class TopLevelDomainRouter extends CrudRouter<TopLevelDomain, TopLevelDomainDao> {
    protected getDao(): TopLevelDomainDao {
        return Container.get(TopLevelDomainDao);
    }

    protected createEntity(requestBody: any): Promise<TopLevelDomain> {
        return new Promise((resolve, reject) => {
            resolve(new TopLevelDomain(requestBody));
        });
    }

    protected getDefaultAuthRole(): AuthRole {
        return AuthRole.ADMIN;
    }
}

export default new TopLevelDomainRouter().router;

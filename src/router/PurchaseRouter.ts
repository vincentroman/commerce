import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";
import { Purchase } from "../entity/Purchase";
import { PurchaseDao } from "../dao/PurchaseDao";
import { AuthRole } from "./BaseRouter";

class PurchaseRouter extends CrudRouter<Purchase, PurchaseDao> {
    protected getDao(): PurchaseDao {
        return Container.get(PurchaseDao);
    }

    protected createEntity(requestBody: any): Promise<Purchase> {
        return new Promise((resolve, reject) => {
            resolve(new Purchase(requestBody));
        });
    }

    protected getDefaultAuthRole(): AuthRole {
        return AuthRole.ADMIN;
    }
}

export default new PurchaseRouter().router;

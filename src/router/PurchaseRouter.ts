import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";
import { Purchase } from "../entity/Purchase";
import { PurchaseDao } from "../dao/PurchaseDao";

class PurchaseRouter extends CrudRouter<Purchase, PurchaseDao> {
    protected getDao(): PurchaseDao {
        return Container.get(PurchaseDao);
    }
    protected createEntity(requestBody: any): Purchase {
        return new Purchase(requestBody);
    }
}

export default new PurchaseRouter().router;

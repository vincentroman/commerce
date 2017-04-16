import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";
import { PurchaseItem } from "../entity/PurchaseItem";
import { PurchaseItemDao } from "../dao/PurchaseItemDao";

class PurchaseItemRouter extends CrudRouter<PurchaseItem, PurchaseItemDao> {
    protected getDao(): PurchaseItemDao {
        return Container.get(PurchaseItemDao);
    }
    protected createEntity(requestBody: any): PurchaseItem {
        return new PurchaseItem(requestBody);
    }
}

export default new PurchaseItemRouter().router;

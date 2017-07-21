import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { PurchaseItem } from "../entity/PurchaseItem";
import { PurchaseItemDao } from "../dao/PurchaseItemDao";
import { PurchaseDao } from "../dao/PurchaseDao";
import { BaseRouter, AuthRole } from "./BaseRouter";

class PurchaseItemRouter extends BaseRouter {
    protected getDao(): PurchaseItemDao {
        return Container.get(PurchaseItemDao);
    }

    protected init(): void {
        this.addRouteGet('/:purchaseId/list', this.list, AuthRole.ADMIN);
    }

    private list(req: Request, res: Response, next: NextFunction): void {
        let purchaseDao: PurchaseDao = Container.get(PurchaseDao);
        let dao: PurchaseItemDao = this.getDao();
        let purchaseId = req.params.purchaseId;
        purchaseDao.getByUuid(purchaseId).then(purchase => {
            dao.getByPurchase(purchase).then(entities => {
                res.send(entities.map(entity => entity.serialize()));
            });
        }).catch(e => this.notFound(res));
    }
}

export default new PurchaseItemRouter().router;

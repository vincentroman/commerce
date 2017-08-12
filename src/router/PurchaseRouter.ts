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

    protected init(): void {
        super.init();
        this.addRouteGet('/latest/:limit', this.getLatest, AuthRole.ADMIN);
    }

    private getLatest(req: Request, res: Response, next: NextFunction): void {
        let dao: PurchaseDao = this.getDao();
        let limit: number = Number(req.params.limit);
        dao.getAll(limit).then(entities => {
            res.send(entities.map(entity => entity.serialize()));
        });
    }
}

export default new PurchaseRouter().router;

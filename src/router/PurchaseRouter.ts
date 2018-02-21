import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";
import { Purchase } from "../entity/Purchase";
import { PurchaseDao } from "../dao/PurchaseDao";
import { AuthRole } from "./BaseRouter";
import { PendingActionDao } from '../dao/PendingActionDao';
import { ActionType } from '../entity/PendingAction';
import { BrokerDao } from '../dao/BrokerDao';
import { MappedOrderInput } from '../util/OrderNotificationMapper';

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
        this.addRouteGet('/pending/:uuid', this.getPendingOrder, AuthRole.ANY);
    }

    private getLatest(req: Request, res: Response, next: NextFunction): void {
        let dao: PurchaseDao = this.getDao();
        let limit: number = Number(req.params.limit);
        dao.getAll(limit).then(entities => {
            res.send(entities.map(entity => entity.serialize()));
        });
    }

    private getPendingOrder(req: Request, res: Response, next: NextFunction): void {
        let actionDao: PendingActionDao = Container.get(PendingActionDao);
        actionDao.getByUuid(req.params.uuid).then(action => {
            if (action && action.type === ActionType.ConfirmOrder) {
                Container.get(BrokerDao).getByUuid(action.getPayload().brokerUuid).then(broker => {
                    if (broker) {
                        let mappedInput: MappedOrderInput = action.getPayload().mappedInput;
                        let result = {
                            broker: {
                                uuid: broker.uuid,
                                name: broker.name
                            },
                            customer: {
                                firstname: mappedInput.customer.firstname,
                                lastname: mappedInput.customer.lastname,
                                company: mappedInput.customer.company,
                                email: mappedInput.customer.email,
                                country: mappedInput.customer.country
                            }
                        };
                        res.status(200).send(result);
                    } else {
                        this.internalServerError(res);
                    }
                }).catch(e => this.internalServerError(res));
            } else {
                this.notFound(res);
            }
        }).catch(e => this.internalServerError(res));
    }
}

export default new PurchaseRouter().router;

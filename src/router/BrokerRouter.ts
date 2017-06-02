import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { Broker } from '../entity/Broker';
import { BrokerDao } from '../dao/BrokerDao';

class BrokerRouter extends CrudRouter<Broker, BrokerDao> {
    protected getDao(): BrokerDao {
        return Container.get(BrokerDao);
    }
    protected createEntity(requestBody: any): Promise<Broker> {
        return new Promise((resolve, reject) => {
            resolve(new Broker(requestBody));
        });
    }
}

export default new BrokerRouter().router;

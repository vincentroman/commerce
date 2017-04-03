import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { Order } from '../entity/Order';
import { OrderDao } from '../dao/OrderDao';

class OrderRouter extends CrudRouter<Order, OrderDao> {
    protected getDao(): OrderDao {
        return Container.get(OrderDao);
    }
    protected createEntity(requestBody: any): Order {
        return new Order(requestBody);
    }
}

export default new OrderRouter().router;

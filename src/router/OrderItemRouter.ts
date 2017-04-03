import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { OrderItem } from '../entity/OrderItem';
import { OrderItemDao } from '../dao/OrderItemDao';

class OrderItemRouter extends CrudRouter<OrderItem, OrderItemDao> {
    protected getDao(): OrderItemDao {
        return Container.get(OrderItemDao);
    }
    protected createEntity(requestBody: any): OrderItem {
        return new OrderItem(requestBody);
    }
}

export default new OrderItemRouter().router;

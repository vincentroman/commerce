import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { Customer } from '../entity/Customer';
import { CustomerDao } from '../dao/CustomerDao';

class CustomerRouter extends CrudRouter<Customer, CustomerDao> {
    protected getDao(): CustomerDao {
        return Container.get(CustomerDao);
    }
    protected createEntity(requestBody: any): Promise<Customer> {
        return new Promise((resolve, reject) => {
            resolve(new Customer(requestBody));
        });
    }
}

export default new CustomerRouter().router;

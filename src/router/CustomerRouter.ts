import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter } from "./BaseRouter";

import { Customer } from '../entity/Customer';
import { CustomerDao } from '../dao/CustomerDao';

class CustomerRouter extends BaseRouter {
    protected init(): void {
        this.router.get('/get/:id', this.getOne.bind(this));
        this.router.get('/list', this.list.bind(this));
        this.router.delete('/delete/:id', this.delete.bind(this));
        this.router.put('/save', this.save.bind(this));
    }

    private getOne(req: Request, res: Response, next: NextFunction): void {
        let dao: CustomerDao = Container.get(CustomerDao);
        let id = req.params.id;
        dao.getByUuid(id).then(customer => {
            res.send(customer.serialize());
        }).catch(e => this.notFound(res));
    }

    private list(req: Request, res: Response, next: NextFunction): void {
        let dao: CustomerDao = Container.get(CustomerDao);
        dao.getAll().then(customers => {
            res.send(customers.map(customer => customer.serialize()));
        });
    }

    private delete(req: Request, res: Response, next: NextFunction): void {
        let dao: CustomerDao = Container.get(CustomerDao);
        let id = req.params.id;
        dao.getByUuid(id).then(customer => {
            dao.delete(customer).then(customer => {
                this.ok(res);
            });
        }).catch(e => this.notFound(e));
    }

    private save(req: Request, res: Response, next: NextFunction): void {
        let dao: CustomerDao = Container.get(CustomerDao);
        if (req.body.uuid) {
            dao.getByUuid(req.body.uuid).then(customer => {
                customer.deserialize(req.body);
                dao.save(customer).then(customer => {
                    this.saved(res, customer);
                });
            }).catch(e => this.notFound(res));
        } else {
            let customer: Customer = new Customer(req.body);
            dao.save(customer).then(customer => {
                this.saved(res, customer);
            });
        }
    }
}

export default new CustomerRouter().router;

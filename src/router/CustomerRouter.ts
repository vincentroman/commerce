import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { Customer } from '../entity/Customer';
import { CustomerDao } from '../dao/CustomerDao';

class CustomerRouter extends CrudRouter<Customer, CustomerDao> {
    protected init(): void {
        super.init();
        this.addRouteGet('/suggest', this.suggest);
    }

    protected getDao(): CustomerDao {
        return Container.get(CustomerDao);
    }

    protected createEntity(requestBody: any): Promise<Customer> {
        return new Promise((resolve, reject) => {
            resolve(new Customer(requestBody));
        });
    }

    private suggest(req: Request, res: Response, next: NextFunction): void {
        let dao: CustomerDao = this.getDao();
        let keyword: string = req.query.s;
        let excludeCustomerUuid: string = req.query.exclude;
        dao.getSuggestions(keyword).then(customers => {
            let result = {};
            customers.forEach(customer => {
                if (!(excludeCustomerUuid && customer.uuid === excludeCustomerUuid)) {
                    result[customer.uuid] = customer.printableName();
                }
            });
            res.send(result);
        });
    }
}

export default new CustomerRouter().router;

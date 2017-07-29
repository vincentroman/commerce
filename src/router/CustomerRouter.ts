import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { Customer } from '../entity/Customer';
import { CustomerDao } from '../dao/CustomerDao';
import { AuthRole } from "./BaseRouter";
import { CommentDao } from "../dao/CommentDao";
import { Comment } from "../entity/Comment";

class CustomerRouter extends CrudRouter<Customer, CustomerDao> {
    protected init(): void {
        super.init();
        this.addRouteGet('/suggest', this.suggest, AuthRole.ADMIN);
        this.addRouteGet('/comments/:id', this.getComments, AuthRole.ADMIN);
        this.addRoutePost('/addcomment/:id', this.addComment, AuthRole.ADMIN);
    }

    protected getDao(): CustomerDao {
        return Container.get(CustomerDao);
    }

    protected createEntity(requestBody: any): Promise<Customer> {
        return new Promise((resolve, reject) => {
            resolve(new Customer(requestBody));
        });
    }

    protected getDefaultAuthRole(): AuthRole {
        return AuthRole.ADMIN;
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

    protected getComments(req: Request, res: Response, next: NextFunction): void {
        let dao: CustomerDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(customer => {
            let commentDao: CommentDao = Container.get(CommentDao);
            commentDao.getAllCustomerComments(customer.uuid).then(comments => {
                res.send(comments.map(comment => comment.serialize()));
            });
        }).catch(e => this.notFound(res));
    }

    protected addComment(req: Request, res: Response, next: NextFunction): void {
        let dao: CustomerDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(customer => {
            this.getJwtUser(req).then(user => {
                let commentDao: CommentDao = Container.get(CommentDao);
                let comment: Comment = new Comment();
                comment.text = req.body.text;
                comment.customer = customer;
                comment.author = user;
                commentDao.save(comment).then(comment => this.saved(res, comment));
            }).catch(e => this.notFound(res));
        }).catch(e => this.notFound(res));
    }
}

export default new CustomerRouter().router;

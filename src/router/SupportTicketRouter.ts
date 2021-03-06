import { CrudRouter } from "./CrudRouter";
import { SupportTicket, SupportRequestStatus } from "../entity/SupportTicket";
import { SupportTicketDao } from "../dao/SupportTicketDao";
import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { ProductVariantDao } from "../dao/ProductVariantDao";
import { Comment } from "../entity/Comment";
import { CommentDao } from "../dao/CommentDao";
import { AuthRole } from "./BaseRouter";
import { PersonDao } from "../dao/PersonDao";

class SupportTicketRouter extends CrudRouter<SupportTicket, SupportTicketDao> {
    protected getDao(): SupportTicketDao {
        return Container.get(SupportTicketDao);
    }

    protected createEntity(requestBody: any): Promise<SupportTicket> {
        return new Promise((resolve, reject) => {
            resolve(new SupportTicket(requestBody));
        });
    }

    protected getDefaultAuthRole(): AuthRole {
        return AuthRole.ADMIN;
    }

    protected init(): void {
        this.addRouteGet('/my', this.my, AuthRole.CUSTOMER);
        this.addRouteGet('/mystats', this.myStats, AuthRole.CUSTOMER);
        this.addRoutePut('/assign', this.assign, AuthRole.ADMIN);
        this.addRouteGet('/stats', this.adminStats, AuthRole.ADMIN);
        this.addRouteGet('/', this.list, this.getDefaultAuthRole());
        this.addRouteGet('/:id/comments', this.getComments, AuthRole.USER);
        this.addRouteGet('/:id', this.getOne, AuthRole.ANY);
        this.addRoutePost('/', this.create, this.getDefaultAuthRole());
        this.addRoutePost('/:id/comments', this.addComment, AuthRole.USER);
        this.addRoutePost('/:id/open', this.open, AuthRole.USER);
        this.addRoutePost('/:id/close', this.close, AuthRole.USER);
        this.addRoutePut('/:id', this.update, this.getDefaultAuthRole());
        this.addRouteDelete('/:id', this.delete, this.getDefaultAuthRole());
    }

    protected adminStats(req: Request, res: Response, next: NextFunction): void {
        let dao: SupportTicketDao = this.getDao();
        let commentDao: CommentDao = Container.get(CommentDao);
        let result = {};
        dao.getAllUnclosedTickets().then(tickets => {
            let numOpenTickets = tickets.length;
            Promise.all(tickets.map(ticket => {
                if (ticket.status === SupportRequestStatus.NEW) {
                    return false;
                } else {
                    return commentDao.getAllSupportTicketComments(ticket.uuid).then(comments => {
                        if (comments.length > 0) {
                            let latest = comments.shift();
                            return (latest.author.id === ticket.customer.id);
                        } else {
                            return true;
                        }
                    });
                }
            })).then(values => {
                let numTicketsWithUnrespondedComments = 0;
                values.forEach(value => {
                    if (value) {
                        numTicketsWithUnrespondedComments++;
                    }
                });
                let result = {
                    numOpenTickets: numOpenTickets,
                    numTicketsWithUnrespondedComments: numTicketsWithUnrespondedComments
                };
                res.send(result);
            });
        });
    }

    protected myStats(req: Request, res: Response, next: NextFunction): void {
        let customerUuid = this.getJwtUserUuid(req);
        let dao: SupportTicketDao = this.getDao();
        let commentDao: CommentDao = Container.get(CommentDao);
        let result = {};
        dao.getAllUnclosedTickets(customerUuid).then(tickets => {
            let numOpenTickets = tickets.length;
            Promise.all(tickets.map(ticket => {
                return commentDao.getAllSupportTicketComments(ticket.uuid).then(comments => {
                    if (comments.length > 0) {
                        let latest = comments.shift();
                        return (latest.author.uuid !== customerUuid);
                    } else {
                        return false;
                    }
                });
            })).then(values => {
                let numTicketsWithUnrespondedComments = 0;
                values.forEach(value => {
                    if (value) {
                        numTicketsWithUnrespondedComments++;
                    }
                });
                let result = {
                    numOpenTickets: numOpenTickets,
                    numTicketsWithUnrespondedComments: numTicketsWithUnrespondedComments
                };
                res.send(result);
            });
        });
    }

    protected getOne(req: Request, res: Response, next: NextFunction): void {
        this.getJwtUser(req).then(user => {
            if (!user || !(user.roleAdmin || user.roleCustomer)) {
                this.forbidden(res);
            } else if (user.roleAdmin) {
                super.getOne(req, res, next);
            } else if (user.roleCustomer) {
                let customerUuid = this.getJwtUserUuid(req);
                let dao: SupportTicketDao = this.getDao();
                let id = req.params.id;
                dao.getByUuid(id).then(entity => {
                    if (entity.customer && entity.customer.uuid === customerUuid) {
                        res.send(entity.serialize());
                    } else {
                        this.forbidden(res);
                    }
                }).catch(e => this.notFound(res));
            }
        }).catch(e => this.forbidden(res));
    }

    private my(req: Request, res: Response, next: NextFunction): void {
        let dao: SupportTicketDao = this.getDao();
        let customerUuid = this.getJwtUserUuid(req);
        dao.getAllCustomerTickets(customerUuid, req.query.size, req.query.skip).then(entities => {
            res.send(entities.map(entity => entity.serialize()));
        });
    }

    protected getComments(req: Request, res: Response, next: NextFunction): void {
        let sendComments = function(entity: SupportTicket) {
            let commentDao: CommentDao = Container.get(CommentDao);
            commentDao.getAllSupportTicketComments(entity.uuid).then(comments => {
                res.send(comments.map(comment => comment.serialize()));
            });
        };
        let customerUuid = this.getJwtUserUuid(req);
        let dao: SupportTicketDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            if (entity.customer && entity.customer.uuid === customerUuid) {
                sendComments(entity);
            } else {
                this.getJwtUser(req).then(user => {
                    if (user.roleAdmin) {
                        sendComments(entity);
                    } else {
                        this.forbidden(res);
                    }
                }).catch(e => this.notFound(res));
            }
        }).catch(e => this.notFound(res));
    }

    private assign(req: Request, res: Response, next: NextFunction): void {
        let personDao: PersonDao = Container.get(PersonDao);
        let productVariantDao: ProductVariantDao = Container.get(ProductVariantDao);
        let dao: SupportTicketDao = this.getDao();
        personDao.getByUuid(req.body.customerUuid).then(customer => {
            productVariantDao.getByUuid(req.body.productVariantUuid).then(productVariant => {
                let supportRequest: SupportTicket = new SupportTicket();
                supportRequest.customer = customer;
                supportRequest.productVariant = productVariant;
                supportRequest.status = SupportRequestStatus.NEW;
                dao.save(supportRequest).then(entity => {
                    this.created(res, entity);
                });
            }).catch((e) => {
                this.badRequest(res);
            });
        }).catch((e) => {
            this.badRequest(res);
        });
    }

    protected open(req: Request, res: Response, next: NextFunction): void {
        let customerUuid = this.getJwtUserUuid(req);
        let dao: SupportTicketDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            if (entity.customer && entity.customer.uuid === customerUuid) {
                entity.text = req.body.text;
                entity.status = SupportRequestStatus.OPEN;
                dao.save(entity).then((entity) => {
                    this.updated(res, entity);
                });
            } else {
                this.forbidden(res);
            }
        }).catch(e => this.notFound(res));
    }

    protected close(req: Request, res: Response, next: NextFunction): void {
        let that = this;
        let doUpdate = function(entity: SupportTicket) {
            entity.status = SupportRequestStatus.CLOSED;
            dao.save(entity).then((entity) => {
                that.updated(res, entity);
            });
        };
        let customerUuid = this.getJwtUserUuid(req);
        let dao: SupportTicketDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            if (entity.customer && entity.customer.uuid === customerUuid) {
                doUpdate(entity);
            } else {
                this.getJwtUser(req).then(user => {
                    if (user.roleAdmin) {
                        doUpdate(entity);
                    } else {
                        this.forbidden(res);
                    }
                }).catch(e => this.notFound(res));
            }
        }).catch(e => this.notFound(res));
    }

    protected addComment(req: Request, res: Response, next: NextFunction): void {
        let customerUuid = this.getJwtUserUuid(req);
        let dao: SupportTicketDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            this.getJwtUser(req).then(user => {
                if ((entity.customer && entity.customer.uuid === customerUuid) || user.roleAdmin) {
                    let commentDao: CommentDao = Container.get(CommentDao);
                    let comment: Comment = new Comment();
                    comment.text = req.body.text;
                    comment.supportTicket = entity;
                    comment.author = user;
                    commentDao.save(comment).then(comment => this.created(res, comment));
                } else {
                    this.forbidden(res);
                }
            }).catch(e => this.notFound(res));
        }).catch(e => this.notFound(res));
    }
}

export default new SupportTicketRouter().router;

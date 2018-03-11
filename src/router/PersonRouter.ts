import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { AuthRole, RestError } from "./BaseRouter";
import { CommentDao } from "../dao/CommentDao";
import { Comment } from "../entity/Comment";
import { Person } from "../entity/Person";
import { PersonDao } from "../dao/PersonDao";
import { PendingActionDao } from "../dao/PendingActionDao";
import { PendingAction, ActionType } from "../entity/PendingAction";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { MailTemplateDao } from "../dao/MailTemplateDao";
import { MailTemplateType } from "../entity/MailTemplate";
import { SystemSettingId } from "../entity/SystemSetting";
import { Address, Email, EmailOptions } from "../util/Email";
import { Log } from '../util/Log';
import { LogEntryType } from '../entity/LogEntry';

class CustomerRouter extends CrudRouter<Person, PersonDao> {
    protected init(): void {
        super.init();
        this.addRouteGet('/suggest', this.suggest, AuthRole.ADMIN);
        this.addRouteGet('/comments/:id', this.getComments, AuthRole.ADMIN);
        this.addRoutePost('/addcomment/:id', this.addComment, AuthRole.ADMIN);
        this.addRoutePost('/sendmail/:id', this.sendMailToUser, AuthRole.ADMIN);
        this.addRoutePost('/sendmail/all', this.sendMailToAllUsers, AuthRole.ADMIN);
        this.addRouteGet('/me', this.me, AuthRole.USER);
        this.addRoutePut('/me/update', this.updateMe, AuthRole.USER);
        this.addRoutePost('/me/confirmdata', this.confirmMyData, AuthRole.USER);
    }

    protected getDao(): PersonDao {
        return Container.get(PersonDao);
    }

    protected createEntity(requestBody: any): Promise<Person> {
        return new Promise((resolve, reject) => {
            resolve(new Person(requestBody));
        });
    }

    protected getDefaultAuthRole(): AuthRole {
        return AuthRole.ADMIN;
    }

    protected save(req: Request, res: Response, next: NextFunction): void {
        let dao: PersonDao = this.getDao();
        let email: string = req.body.email;
        let uuid: string = req.body.uuid;
        dao.getByEmail(email).then(person => {
            if (!person || person.uuid === uuid) {
                super.save(req, res, next);
            } else {
                this.badRequest(res, RestError.EMAIL_ALREADY_EXISTS);
            }
        });
    }

    private suggest(req: Request, res: Response, next: NextFunction): void {
        let dao: PersonDao = this.getDao();
        let keyword: string = req.query.s;
        let excludeCustomerUuid: string = req.query.exclude;
        let excludeAdmin: boolean = (req.query.excludeAdmin === "1");
        let excludeCustomer: boolean = (req.query.excludeCustomer === "1");
        dao.getSuggestions(keyword).then(customers => {
            let result = {};
            customers.forEach(customer => {
                if (!(excludeCustomerUuid && customer.uuid === excludeCustomerUuid)) {
                    if (!(customer.roleAdmin && excludeAdmin)) {
                        if (!(customer.roleCustomer && excludeCustomer)) {
                            result[customer.uuid] = customer.printableName() + " - " + customer.email;
                        }
                    }
                }
            });
            res.send(result);
        });
    }

    protected getComments(req: Request, res: Response, next: NextFunction): void {
        let dao: PersonDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(customer => {
            let commentDao: CommentDao = Container.get(CommentDao);
            commentDao.getAllCustomerComments(customer.uuid).then(comments => {
                res.send(comments.map(comment => comment.serialize()));
            });
        }).catch(e => this.notFound(res));
    }

    protected addComment(req: Request, res: Response, next: NextFunction): void {
        let dao: PersonDao = this.getDao();
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

    private sendMailToUser(req: Request, res: Response, next: NextFunction): void {
        let dao: PersonDao = Container.get(PersonDao);
        let settings: SystemSettingDao = Container.get(SystemSettingDao);
        settings.getString(SystemSettingId.MailServer_Sender_Name, "").then(senderName => {
            settings.getString(SystemSettingId.MailServer_Sender_Email, "").then(senderEmail => {
                let sender = {
                    name: senderName,
                    email: senderEmail
                };
                dao.getByUuid(req.params.id).then(user => {
                    if (user) {
                        let params = {
                            firstname: user.firstname,
                            lastname: user.lastname,
                            company: user.company
                        };
                        let recipient: Address = {
                            email: user.email
                        };
                        let renderedSubject: string = Email.renderParamString(req.body.subject, params);
                        let renderedTemplate: string = Email.renderParamString(req.body.body, params);
                        let options: EmailOptions = {
                            recipient: recipient,
                            sender: sender,
                            subject: renderedSubject,
                            text: renderedTemplate
                        };
                        Email.send(options);
                        this.ok(res);
                    } else {
                        this.notFound(res);
                    }
                });
            });
        });
    }

    private sendMailToAllUsers(req: Request, res: Response, next: NextFunction): void {
        let dao: PersonDao = Container.get(PersonDao);
        let settings: SystemSettingDao = Container.get(SystemSettingDao);
        settings.getString(SystemSettingId.MailServer_Sender_Name, "").then(senderName => {
            settings.getString(SystemSettingId.MailServer_Sender_Email, "").then(senderEmail => {
                let sender = {
                    name: senderName,
                    email: senderEmail
                };
                dao.getAll().then(users => {
                    users.forEach(user => {
                        let params = {
                            firstname: user.firstname,
                            lastname: user.lastname,
                            company: user.company
                        };
                        let recipient: Address = {
                            email: user.email
                        };
                        let renderedSubject: string = Email.renderParamString(req.body.subject, params);
                        let renderedTemplate: string = Email.renderParamString(req.body.body, params);
                        let options: EmailOptions = {
                            recipient: recipient,
                            sender: sender,
                            subject: renderedSubject,
                            text: renderedTemplate
                        };
                        Email.send(options);
                    });
                    this.ok(res);
                });
            });
        });
    }

    private me(req: Request, res: Response, next: NextFunction): void {
        let uuid = this.getJwtUserUuid(req);
        let dao = this.getDao();
        dao.getByUuid(uuid).then((user) => {
            res.send(user.serialize());
        }).catch(e => this.notFound(res));
    }

    private updateMe(req: Request, res: Response, next: NextFunction): void {
        let uuid = this.getJwtUserUuid(req);
        let dao = this.getDao();
        let finishUpdate = function(user: Person) {
            if (user.isConsistent()) {
                dao.save(user)
                    .then(user => this.saved(res, user))
                    .catch(e => this.internalServerError(res));
            } else {
                this.badRequest(res);
            }
        };
        dao.getByUuid(uuid).then((user) => {
            if (user) {
                let oldEmail = user.email;
                if (user.receiveProductUpdates && !req.body.receiveProductUpdates) {
                    Log.info("Opting out from product updates" +
                        " for customer " + user.uuid +
                        " from ip " + req.ip,
                        LogEntryType.OptOut);
                } else if (!user.receiveProductUpdates && req.body.receiveProductUpdates) {
                    Log.info("Opting in for product updates" +
                        " for customer " + user.uuid +
                        " from ip " + req.ip,
                        LogEntryType.OptIn);
                }
                user.deserialize(req.body);
                user.lastDataVerification = new Date();
                if (user.email !== oldEmail) {
                    let newEmail = user.email;
                    user.email = oldEmail;
                    this.sendEmailUpdateDoi(user, newEmail).then(() => finishUpdate.call(this, user));
                } else {
                    finishUpdate.call(this, user);
                }
            } else {
                this.notFound(res);
            }
        }).catch(e => this.notFound(res));
    }

    private confirmMyData(req: Request, res: Response, next: NextFunction): void {
        let uuid = this.getJwtUserUuid(req);
        let dao = this.getDao();
        dao.getByUuid(uuid).then((user) => {
            if (user) {
                user.lastDataVerification = new Date();
                if (user.isConsistent()) {
                    dao.save(user)
                        .then(user => this.saved(res, user))
                        .catch(e => this.internalServerError(res));
                } else {
                    this.badRequest(res);
                }
            } else {
                this.notFound(res);
            }
        }).catch(e => this.notFound(res));
    }

    private sendEmailUpdateDoi(person: Person, newEmail: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let actionDao: PendingActionDao = Container.get(PendingActionDao);
            let settingsDao: SystemSettingDao = Container.get(SystemSettingDao);
            let mailTemplateDao: MailTemplateDao = Container.get(MailTemplateDao);
            let action: PendingAction = actionDao.createChangeEmailAction();
            action.setPayload({
                userId: person.id,
                email: newEmail
            });
            actionDao.save(action).then(action => {
                mailTemplateDao.getByType(MailTemplateType.ChangeEmail).then(mailTemplate => {
                    settingsDao.getString(SystemSettingId.Site_Url, "").then(siteUrl => {
                        let params = {
                            firstname: person.firstname,
                            lastname: person.lastname,
                            uuid: action.uuid,
                            siteUrl: siteUrl
                        };
                        let recipient: Address = {
                            email: newEmail
                        };
                        Email.sendByTemplate(mailTemplate, recipient, params).then(() => resolve());
                    }).catch(e => reject(e));
                }).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }
}

export default new CustomerRouter().router;

import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter, AuthRole } from "./BaseRouter";

import { Dao } from '../dao/Dao';
import { DbEntity } from '../entity/DbEntity';

export abstract class CrudRouter<TEntity extends DbEntity<TEntity>, TDao extends Dao<TEntity>> extends BaseRouter {
    protected abstract getDao(): TDao;
    protected abstract createEntity(requestBody: any): Promise<TEntity>;
    protected abstract getDefaultAuthRole(): AuthRole;

    protected fixRelationsBeforeSave(entity: TEntity): Promise<TEntity> {
        return new Promise((resolve, reject) => {
            resolve(entity);
        });
    }

    protected init(): void {
        this.addRouteGet('/get/:id', this.getOne, this.getDefaultAuthRole());
        this.addRouteGet('/list', this.list, this.getDefaultAuthRole());
        this.addRouteDelete('/delete/:id', this.delete, this.getDefaultAuthRole());
        this.addRoutePut('/save', this.save, this.getDefaultAuthRole());
    }

    private getOne(req: Request, res: Response, next: NextFunction): void {
        let dao: TDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            if (entity) {
                res.send(entity.serialize());
            } else {
                this.notFound(res);
            }
        }).catch(e => {
            // TODO Log exception
            this.internalServerError(res);
        });
    }

    private list(req: Request, res: Response, next: NextFunction): void {
        let dao: TDao = this.getDao();
        dao.getAll().then(entities => {
            res.send(entities.map(entity => entity.serialize()));
        });
    }

    private delete(req: Request, res: Response, next: NextFunction): void {
        let dao: TDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            if (entity) {
                dao.delete(entity).then(entity => {
                    this.ok(res);
                }).catch(e => this.internalServerError(res));
            } else {
                this.notFound(res);
            }
        }).catch(e => this.notFound(res));
    }

    private save(req: Request, res: Response, next: NextFunction): void {
        let dao: TDao = this.getDao();
        if (req.body.uuid) {
            dao.getByUuid(req.body.uuid).then(entity => {
                if (entity) {
                    entity.deserialize(req.body);
                    this.fixRelationsBeforeSave(entity).then(entity => {
                        if (entity.isConsistent()) {
                            dao.save(entity).then(entity => {
                                this.saved(res, entity);
                            }).catch(e => this.internalServerError(res));
                        } else {
                            this.badRequest(res);
                        }
                    }).catch(e => this.notFound(res));
                } else {
                    this.notFound(res);
                }
            }).catch(e => this.notFound(res));
        } else {
            this.createEntity(req.body).then(entity => {
                if (entity.isConsistent()) {
                    dao.save(entity).then(entity => {
                        this.saved(res, entity);
                    }).catch(e => this.badRequest(res));
                } else {
                    this.badRequest(res);
                }
            }).catch(e => this.badRequest(res));
        }
    }
}

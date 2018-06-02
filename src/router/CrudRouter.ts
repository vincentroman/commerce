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
        this.addRouteGet('/', this.list, this.getDefaultAuthRole());
        this.addRouteGet('/:id', this.getOne, this.getDefaultAuthRole());
        this.addRoutePost('/', this.create, this.getDefaultAuthRole());
        this.addRoutePut('/:id', this.update, this.getDefaultAuthRole());
        this.addRouteDelete('/:id', this.delete, this.getDefaultAuthRole());
    }

    protected getOne(req: Request, res: Response, next: NextFunction): void {
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

    protected list(req: Request, res: Response, next: NextFunction): void {
        let dao: TDao = this.getDao();
        dao.getAll(req.query.size, req.query.skip).then(entities => {
            res.send(entities.map(entity => entity.serialize()));
        });
    }

    protected delete(req: Request, res: Response, next: NextFunction): void {
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

    protected create(req: Request, res: Response, next: NextFunction): void {
        let dao: TDao = this.getDao();
        if (req.body.uuid) {
            this.badRequest(res);
            return;
        }
        this.createEntity(req.body).then(entity => {
            if (entity.isConsistent()) {
                dao.save(entity).then(entity => {
                    this.created(res, entity);
                }).catch(e => this.badRequest(res));
            } else {
                this.badRequest(res);
            }
        }).catch(e => this.badRequest(res));
    }

    protected update(req: Request, res: Response, next: NextFunction): void {
        let dao: TDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            if (entity) {
                entity.deserialize(req.body);
                this.fixRelationsBeforeSave(entity).then(entity => {
                    if (entity.isConsistent()) {
                        dao.save(entity).then(entity => {
                            this.updated(res, entity);
                        }).catch(e => this.internalServerError(res));
                    } else {
                        this.badRequest(res);
                    }
                }).catch(e => this.notFound(res));
            } else {
                this.notFound(res);
            }
        }).catch(e => this.notFound(res));
    }
}

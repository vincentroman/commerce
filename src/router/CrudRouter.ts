import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { BaseRouter } from "./BaseRouter";

import { Dao } from '../dao/Dao';
import { DbEntity } from '../entity/DbEntity';

export abstract class CrudRouter<TEntity extends DbEntity, TDao extends Dao<TEntity>> extends BaseRouter {
    protected abstract getDao(): TDao;
    protected abstract createEntity(requestBody: any): TEntity;

    protected init(): void {
        this.router.get('/get/:id', this.getOne.bind(this));
        this.router.get('/list', this.list.bind(this));
        this.router.delete('/delete/:id', this.delete.bind(this));
        this.router.put('/save', this.save.bind(this));
    }

    private getOne(req: Request, res: Response, next: NextFunction): void {
        let dao: TDao = this.getDao();
        let id = req.params.id;
        dao.getByUuid(id).then(entity => {
            res.send(entity.serialize());
        }).catch(e => this.notFound(res));
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
            dao.delete(entity).then(entity => {
                this.ok(res);
            });
        }).catch(e => this.notFound(e));
    }

    private save(req: Request, res: Response, next: NextFunction): void {
        let dao: TDao = this.getDao();
        if (req.body.uuid) {
            dao.getByUuid(req.body.uuid).then(entity => {
                entity.deserialize(req.body);
                dao.save(entity).then(entity => {
                    this.saved(res, entity);
                });
            }).catch(e => this.notFound(res));
        } else {
            let entity: TEntity = this.createEntity(req.body);
            dao.save(entity).then(entity => {
                this.saved(res, entity);
            });
        }
    }
}

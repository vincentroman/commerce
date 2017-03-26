import { Router, Response } from 'express';
import { DbEntity } from '../entity/DbEntity';

export abstract class BaseRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    protected ok(res: Response): void {
        res.status(200).send({
            message: "Operation successful",
            status: res.status
        });
    }

    protected saved(res: Response, entity: DbEntity): void {
        res.status(200).send({
            message: "Object saved",
            uuid: entity.uuid,
            status: res.status
        });
    }

    protected notFound(res: Response): void {
        res.status(404).send({
            message: "Object not found",
            status: res.status
        });
    }

    protected abstract init(): void;
}

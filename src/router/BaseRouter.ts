import { Router, Response, Request, NextFunction } from 'express';
import { DbEntity } from '../entity/DbEntity';
import { Config } from '../util/Config';
import * as jwt from 'jsonwebtoken';

export abstract class BaseRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    protected checkAuth(req: Request, res: Response, next: NextFunction): void {
        let authHeader: string = req.header('Authorization');
        if (authHeader.startsWith('Bearer ')) {
            let token: string = authHeader.substr('Bearer '.length);
            let config = Config.getInstance().get("session");
            let options = {
                algorithms: ['HS256'],
                issuer: config.issuer
            };
            try {
                let payload = jwt.verify(token, config.secret, options);
                next();
                return;
            } catch (e) {
                // Invalid JWT token
            }
        }
        this.forbidden(res);
    }

    protected addRoutePost(route: string, fn: Function, authRequired?: boolean): void {
        if (authRequired) {
            this.router.post(route, this.checkAuth.bind(this), fn.bind(this));
        } else {
            this.router.post(route, fn.bind(this));
        }
    }

    protected addRouteGet(route: string, fn: Function, authRequired?: boolean): void {
        if (authRequired) {
            this.router.get(route, this.checkAuth.bind(this), fn.bind(this));
        } else {
            this.router.get(route, fn.bind(this));
        }
    }

    protected addRoutePut(route: string, fn: Function, authRequired?: boolean): void {
        if (authRequired) {
            this.router.put(route, this.checkAuth.bind(this), fn.bind(this));
        } else {
            this.router.put(route, fn.bind(this));
        }
    }

    protected addRouteDelete(route: string, fn: Function, authRequired?: boolean): void {
        if (authRequired) {
            this.router.delete(route, this.checkAuth.bind(this), fn.bind(this));
        } else {
            this.router.delete(route, fn.bind(this));
        }
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

    protected forbidden(res: Response): void {
        res.status(403).send({
            message: "Forbidden",
            status: res.status
        });
    }

    protected abstract init(): void;
}

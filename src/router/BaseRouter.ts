import { Router, Response, Request, NextFunction, RequestHandler } from 'express';
import { DbEntity } from '../entity/DbEntity';
import { Config } from '../util/Config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from "../util/JwtPayload";
import { Container } from "typedi";
import { Person } from "../entity/Person";
import { PersonDao } from "../dao/PersonDao";

export abstract class BaseRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    protected checkAuth(req: Request, res: Response, next: NextFunction): void {
        try {
            this.getJwtPayload(req);
            next();
            return;
        } catch (e) {
            this.forbidden(res);
        }
    }

    protected getJwtUserUuid(req: Request): string {
        let payload = this.getJwtPayload(req);
        return payload.userId;
    }

    protected async getJwtUser(req: Request): Promise<Person> {
        let uuid = this.getJwtUserUuid(req);
        let dao: PersonDao = Container.get(PersonDao);
        return dao.getByUuid(uuid);
    }

    protected getJwtPayload(req: Request): JwtPayload {
        let authHeader: string = req.header('Authorization');
        if (authHeader.startsWith('Bearer ')) {
            let token: string = authHeader.substr('Bearer '.length);
            let config = Config.getInstance().get("session");
            let options = {
                algorithms: ['HS256'],
                issuer: config.issuer
            };
            let payload = <JwtPayload>jwt.verify(token, config.secret, options);
            return payload;
        } else {
            throw new Error("No JWT header found");
        }
    }

    private getAuthInterceptorFunction(role: AuthRole): RequestHandler {
        return function(req: Request, res: Response, next: NextFunction): void {
            if (role === AuthRole.ANY) {
                next();
                return;
            }
            this.getJwtUser(req).then(user => {
                if (role === AuthRole.GUEST) {
                    if (user) {
                        this.forbidden(res);
                    } else {
                        next();
                    }
                } else if (role === AuthRole.USER) {
                    if (user) {
                        next();
                    } else {
                        this.forbidden(res);
                    }
                    return;
                } else if (role === AuthRole.ADMIN) {
                    if (user && user.roleAdmin) {
                        next();
                    } else {
                        this.forbidden(res);
                    }
                    return;
                } else if (role === AuthRole.CUSTOMER) {
                    if (user && user.roleCustomer) {
                        next();
                    } else {
                        this.forbidden(res);
                    }
                    return;
                } else {
                    console.error("getAuthInterceptorFunction() called with unknown role %d", role);
                    this.internalServerError(res);
                }
            }).catch(e => {
                if (role === AuthRole.GUEST) {
                    next();
                } else {
                    this.forbidden(res);
                }
            });
        }.bind(this);
    }

    protected addRoutePost(route: string, fn: Function, role: AuthRole): void {
        this.router.post(route, this.getAuthInterceptorFunction(role).bind(this), fn.bind(this));
    }

    protected addRouteGet(route: string, fn: Function, role: AuthRole): void {
        this.router.get(route, this.getAuthInterceptorFunction(role).bind(this), fn.bind(this));
    }

    protected addRoutePut(route: string, fn: Function, role: AuthRole): void {
        this.router.put(route, this.getAuthInterceptorFunction(role).bind(this), fn.bind(this));
    }

    protected addRouteDelete(route: string, fn: Function, role: AuthRole): void {
        this.router.delete(route, this.getAuthInterceptorFunction(role).bind(this), fn.bind(this));
    }

    protected ok(res: Response): void {
        res.status(200).send({
            message: "Operation successful",
            status: res.status
        });
    }

    protected saved(res: Response, entity: DbEntity<any>): void {
        res.status(200).send({
            message: "Object saved",
            uuid: (entity ? entity.uuid : ""),
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

    protected badRequest(res: Response, errorCode?: number, errorMessage?: string): void {
        res.status(400).send({
            message: (errorMessage ? errorMessage : "Bad Request"),
            status: res.status,
            errorCode: (errorCode ? errorCode : 0)
        });
    }

    protected internalServerError(res: Response): void {
        res.status(500).send({
            message: "Internal Server Error",
            status: res.status
        });
    }

    protected abstract init(): void;
}

export enum AuthRole {
    ANY,
    GUEST,
    USER,
    CUSTOMER,
    ADMIN
}

export enum RestError {
    INVALID_TLD = 1,
    EMAIL_ALREADY_EXISTS = 2
}

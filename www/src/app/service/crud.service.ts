import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";

import { HttpService } from "./http.service";
import { RestModel } from "../model/rest-model";
import { Observable } from "rxjs/Observable";

export abstract class CrudService<T extends RestModel<T>> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {}

    protected abstract getPath(): string;

    protected abstract newTypeInstance(): T;

    list(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: T[] = (<T[]>res.json()).map(o => this.newTypeInstance().deserialize(o));
                resolve(list);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    get(id: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/" + id), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let entity = this.newTypeInstance().deserialize(<T>res.json());
                resolve(entity);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    save(entity: T): Promise<T> {
        return new Promise((resolve, reject) => {
            let req: Observable<Response>;
            if (entity.uuid) {
                req = this.http.put(this.httpService.getUrl(this.getPath() + "/" + entity.uuid), entity.serialize(), this.httpService.getOptions());
            } else {
                req = this.http.post(this.httpService.getUrl(this.getPath() + "/"), entity.serialize(), this.httpService.getOptions());
            }
            req.toPromise()
            .then(res => {
                entity.uuid = res.json().uuid;
                resolve(entity);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    delete(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.delete(this.httpService.getUrl(this.getPath() + "/" + id), this.httpService.getOptions())
            .toPromise()
            .then(res => resolve())
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }
}

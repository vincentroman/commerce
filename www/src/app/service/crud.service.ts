import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";

import { HttpService } from "./http.service";
import { RestModel } from "../model/rest-model";

export abstract class CrudService<T extends RestModel<T>> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {}

    protected abstract getPath(): string;

    protected abstract newTypeInstance(): T;

    list(): Promise<T[]> {
        return this.http
            .get(this.httpService.getUrl(this.getPath() + "/list"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: T[] = (<T[]>res.json()).map(o => this.newTypeInstance().deserialize(o));
                return list;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    get(id: string): Promise<T> {
        return this.http
            .get(this.httpService.getUrl(this.getPath() + "/get/" + id), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let entity = this.newTypeInstance().deserialize(<T>res.json());
                return entity;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    save(entity: T): Promise<T> {
        return this.http.put(this.httpService.getUrl(this.getPath() + "/save"), entity.serialize(), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                entity.uuid = res.json().uuid;
                return entity;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    delete(id: string): Promise<void> {
        return this.http.delete(this.httpService.getUrl(this.getPath() + "/delete/" + id), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }
}

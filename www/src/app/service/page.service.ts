import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";

import { SessionService } from "./session.service";
import { HttpService } from "./http.service";

import { Page } from "../model/page";

@Injectable()
export class PageService {
    constructor(
        private sessionService: SessionService,
        private httpService: HttpService,
        private http: Http
    ) {}

    list(): Promise<Page[]> {
        return this.http
            .get(this.httpService.getUrl("page/list"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: Page[] = (<Page[]>res.json()).map(o => new Page().deserialize(o));
                return list;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    get(id: string): Promise<Page> {
        return this.http
            .get(this.httpService.getUrl("page/get/" + id), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let page = new Page().deserialize(<Page>res.json());
                return page;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    save(page: Page): Promise<Page> {
        return this.http.post(this.httpService.getUrl("page/set"), page.serialize(), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let page = new Page().deserialize(<Page>res.json());
                return page;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    delete(id: string): Promise<void> {
        return this.http.delete(this.httpService.getUrl("page/delete/" + id), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }
}

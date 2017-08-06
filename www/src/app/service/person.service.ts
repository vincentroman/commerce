import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { Comment } from "../model/comment";
import { SessionService } from "./session.service";
import * as Bloodhound from "bloodhound";
import * as typeahead from "typeahead.js";
import * as $ from "jquery";
import { Person } from "../model/person";

@Injectable()
export class PersonService extends CrudService<Person> {
    constructor(
        protected httpService: HttpService,
        protected http: Http,
        private sessionService: SessionService
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): Person {
        return new Person();
    }

    protected getPath(): string {
        return "person";
    }

    getCustomerSuggestionBloodhoundSource(excludeCustomerId?: string): Bloodhound<Object> {
        let url = this.httpService.getUrl("person/suggest");
        let jwt = this.sessionService.jwt;
        return new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: url + "?excludeAdmin=1&exclude=" + excludeCustomerId + "&s=%QUERY",
                wildcard: "%QUERY",
                prepare: function(query, settings) {
                    settings.url = url + "?excludeAdmin=1&exclude=" + excludeCustomerId + "&s=" + query;
                    settings.headers = {
                        "Authorization": "Bearer " + jwt
                    };
                    return settings;
                },
                transform: function(resp: Object) {
                    return $.map(resp, function(v, k) {
                        return {id: k, value: v};
                    });
                }
            }
        });
    }

    getComments(id: string): Promise<Comment[]> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/comments/" + id), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: Comment[] = (<Comment[]>res.json()).map(o => new Comment().deserialize(o));
                resolve(list);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    addComment(id: string, text: string): Promise<string> {
        let payload = {
            text: text
        };
        return this.http.post(this.httpService.getUrl(this.getPath() + "/addcomment/" + id), payload, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return res.json().uuid;
            })
            .catch(error => {
                return this.httpService.handleError(error);
            });
    }

    me(): Promise<Person> {
        return this.http
            .get(this.httpService.getUrl(this.getPath() + "/me"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let user = this.newTypeInstance().deserialize(res.json());
                return user;
            })
            .catch(error => {
                throw this.httpService.handleError(error);
            });
    }
}

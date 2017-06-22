import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { Customer } from "../model/customer";
import { SessionService } from "./session.service";
import * as Bloodhound from "bloodhound";
import * as typeahead from "typeahead.js";
import * as $ from "jquery";

@Injectable()
export class CustomerService extends CrudService<Customer> {
    constructor(
        protected httpService: HttpService,
        protected http: Http,
        private sessionService: SessionService
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): Customer {
        return new Customer();
    }

    protected getPath(): string {
        return "customer";
    }

    getCustomerSuggestionBloodhoundSource(excludeCustomerId?: string): Bloodhound<Object> {
        let url = this.httpService.getUrl("customer/suggest");
        let jwt = this.sessionService.jwt;
        return new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: url + "?exclude=" + excludeCustomerId + "&s=%QUERY",
                wildcard: "%QUERY",
                prepare: function(query, settings) {
                    settings.url = url + "?exclude=" + excludeCustomerId + "&s=" + query;
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
}

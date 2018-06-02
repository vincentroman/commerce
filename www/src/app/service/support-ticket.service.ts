import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpService } from "./http.service";
import { CrudService } from "./crud.service";
import { ProductVariantType } from "../model/product-variant";
import { SupportTicket } from "../model/support-ticket";
import { Comment } from "../model/comment";

@Injectable()
export class SupportTicketService extends CrudService<SupportTicket> {
    constructor(
        protected httpService: HttpService,
        protected http: Http
    ) {
        super(httpService, http);
    }

    protected newTypeInstance(): SupportTicket {
        return new SupportTicket();
    }

    protected getPath(): string {
        return "supportticket";
    }

    my(maxResults?: number, skipNumResults?: number): Promise<SupportTicket[]> {
        let params = {};
        if (typeof maxResults !== "undefined") {
            params["size"] = maxResults;
        }
        if (typeof skipNumResults !== "undefined") {
            params["skip"] = skipNumResults;
        }
        let options = Object.assign({params: params}, this.httpService.getOptions());
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/my"), options)
            .toPromise()
            .then(res => {
                let list: SupportTicket[] = (<SupportTicket[]>res.json()).map(o => this.newTypeInstance().deserialize(o));
                resolve(list);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    myStats(): Promise<SupportTicketStats> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/mystats"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let entity = <SupportTicketStats>res.json();
                resolve(entity);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    adminStats(): Promise<SupportTicketStats> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/stats"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let entity = <SupportTicketStats>res.json();
                resolve(entity);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    getComments(id: string): Promise<Comment[]> {
        return new Promise((resolve, reject) => {
            this.http
            .get(this.httpService.getUrl(this.getPath() + "/" + id + "/comments"), this.httpService.getOptions())
            .toPromise()
            .then(res => {
                let list: Comment[] = (<Comment[]>res.json()).map(o => new Comment().deserialize(o));
                resolve(list);
            })
            .catch(error => reject(this.httpService.handleError(error)));
        });
    }

    assign(productVariantUuid: string, customerUuid: string): Promise<string> {
        let payload = {
            productVariantUuid: productVariantUuid,
            customerUuid: customerUuid
        };
        return this.http.put(this.httpService.getUrl(this.getPath() + "/assign"), payload, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return res.json().uuid;
            })
            .catch(error => {
                throw this.httpService.handleError(error);
            });
    }

    open(id: string, text: string): Promise<string> {
        let payload = {
            text: text
        };
        return this.http.post(this.httpService.getUrl(this.getPath() + "/" + id + "/open"), payload, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return res.json().uuid;
            })
            .catch(error => {
                throw this.httpService.handleError(error);
            });
    }

    close(id: string): Promise<string> {
        return this.http.post(this.httpService.getUrl(this.getPath() + "/" + id + "/close"), null, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return res.json().uuid;
            })
            .catch(error => {
                throw this.httpService.handleError(error);
            });
    }

    addComment(id: string, text: string): Promise<string> {
        let payload = {
            text: text
        };
        return this.http.post(this.httpService.getUrl(this.getPath() + "/" + id + "/comments"), payload, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                return res.json().uuid;
            })
            .catch(error => {
                throw this.httpService.handleError(error);
            });
    }
}

export declare class SupportTicketStats {
    numOpenTickets: number;
    numTicketsWithUnrespondedComments: number;
}

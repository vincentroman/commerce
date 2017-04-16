import { Injectable } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";

import { SessionService } from "./session.service";

@Injectable()
export class HttpService {
    restUrl: string;

    constructor(
        private sessionService: SessionService
    ) {
        if (location.hostname === "localhost") {
            this.restUrl = "http://localhost:5000/api/";
        } else {
            this.restUrl = "/api/";
        }
    }

    getHeaders(): Headers {
        return new Headers({
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.sessionService.getJwt()
        });
    }

    getOptions(): any {
        return {headers: this.getHeaders()};
    }

    getUrl(service: string): string {
        return this.restUrl + service;
    }

    handleError(error: Response): Response {
        if (error.status === 403) {
            this.sessionService.logout();
        }
        return error;
    }
}

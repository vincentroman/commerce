import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "../service/session.service";

@Component({
    templateUrl: "./broker-list.component.html",
    providers: [
    ]
})
export class BrokerListComponent {
    session: SessionService;

    constructor(
        private sessionService: SessionService
    ) {
        this.session = sessionService;
    }
}

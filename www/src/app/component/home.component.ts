import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "../service/session.service";

@Component({
    templateUrl: "./home.component.html",
    providers: [
    ]
})
export class HomeComponent {
    session: SessionService;

    constructor(
        private sessionService: SessionService
    ) {
        this.session = sessionService;
    }
}

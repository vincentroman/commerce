import { Component, Input } from "@angular/core";

import { SessionService } from "../service/session.service";

/* tslint:disable:max-line-length */

@Component({
    selector: "ul.navbar-nav.nav",
    template: `
        <li [routerLinkActive]="['active']"><a routerLink="/">Home<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-home"></span></a></li>
        <li [routerLinkActive]="['active']"><a routerLink="/brokers">Brokers<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-briefcase"></span></a></li>
        <li [routerLinkActive]="['active']"><a routerLink="/customers">Customers<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-user"></span></a></li>
        <li [routerLinkActive]="['active']"><a routerLink="/licensekeys">License Keys<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-barcode"></span></a></li>
        <li [routerLinkActive]="['active']"><a routerLink="/supportrequests">Support Requests<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-question-sign"></span></a></li>
        <li [routerLinkActive]="['active']"><a routerLink="/mailtemplates">Mail Templates<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-envelope"></span></a></li>
        <li [routerLinkActive]="['active']"><a routerLink="/orders">Orders<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-shopping-cart"></span></a></li>
        <li [routerLinkActive]="['active']"><a routerLink="/products">Products<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-book"></span></a></li>
    `
})
export class NavComponent {
    session: SessionService;

    constructor (
        private sessionService: SessionService
    ) {
        this.session = sessionService;
    }
}
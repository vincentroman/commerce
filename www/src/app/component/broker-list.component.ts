import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "./entity-list.component";

import { BrokerService } from "../service/broker.service";
import { Broker } from "../model/broker";

@Component({
    templateUrl: "./broker-list.component.html",
    providers: [
        BrokerService
    ]
})
export class BrokerListComponent extends EntityListComponent<Broker> {
    constructor(
        protected router: Router,
        protected brokerService: BrokerService
    ) {
        super(router, brokerService);
    }

    protected getEditPath(): string {
        return "/brokers/edit";
    }
}

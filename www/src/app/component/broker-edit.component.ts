import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "./entity-edit.component";
import { BrokerService } from "../service/broker.service";
import { Broker } from "../model/broker";

@Component({
    templateUrl: "./broker-edit.component.html",
    providers: [
        BrokerService
    ]
})
export class BrokerEditComponent extends EntityEditComponent<Broker> {
    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected brokerService: BrokerService
    ) {
        super(route, router, brokerService);
    }

    protected newTypeInstance(): Broker {
        return new Broker();
    }

    protected getListPath(): string {
        return "/brokers";
    }
}

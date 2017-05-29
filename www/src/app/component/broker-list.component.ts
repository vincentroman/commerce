import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BrokerService } from "../service/broker.service";
import { Broker } from "../model/broker";

@Component({
    templateUrl: "./broker-list.component.html",
    providers: [
        BrokerService
    ]
})
export class BrokerListComponent implements OnInit {
    brokers: Broker[];

    constructor(
        private router: Router,
        private brokerService: BrokerService
    ) {}

    ngOnInit(): void {
        this.brokerService.list().then(brokers => this.brokers = brokers);
    }

    showBroker(uuid: string): void {
        this.router.navigate(["/brokers/edit", uuid]);
    }
}

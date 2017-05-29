import { Component, Input, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { BrokerService } from "../service/broker.service";
import { Broker } from "../model/broker";

@Component({
    templateUrl: "./broker-edit.component.html",
    providers: [
        BrokerService
    ]
})
export class BrokerEditComponent implements OnInit {
    broker: Broker = new Broker();
    submitting: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private brokerService: BrokerService
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id: string = params["id"];
            if (id) {
                this.brokerService.get(id).then(broker => this.broker = broker);
            }
        });
    }

    submit(): void {
        this.submitting = true;
        this.success = false;
        this.brokerService.save(this.broker)
            .then(broker => {
                this.broker = broker;
                this.submitting = false;
                this.success = true;
            });
    }

    delete(uuid: string): void {
        if (confirm("Delete this broker?")) {
            this.submitting = true;
            this.success = false;
            this.brokerService.delete(this.broker.uuid)
                .then(res => this.router.navigate(["/brokers"]));
        }
    }
}

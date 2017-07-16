import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { BrokerService } from "../../service/broker.service";
import { Broker } from "../../model/broker";
import { Http } from "@angular/http";
import { HttpService } from "../../service/http.service";

@Component({
    templateUrl: "./broker-test.component.html",
    providers: [
        BrokerService
    ]
})
export class BrokerTestComponent implements OnInit {
    entity: Broker = new Broker();
    uuid: string = "";
    submitting: boolean = false;
    error: boolean = false;
    success: boolean = false;
    result: string = "";
    model = {
        contentType: "application/json",
        payload: ""
    };

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected httpService: HttpService,
        protected http: Http,
        protected brokerService: BrokerService
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let uuid: string = params["uuid"];
            if (uuid) {
                this.uuid = uuid;
            }
        });
        this.brokerService.get(this.uuid).then(entity => this.entity = entity);
    }

    submit(): void {
        this.submitting = true;
        this.error = false;
        this.success = false;
        let options = {
            headers: new Headers({
                "Content-Type": this.model.contentType
            })
        };
        this.http.post(this.httpService.getUrl("ordernotification/" + this.uuid), this.model.payload, this.httpService.getOptions())
            .toPromise()
            .then(res => {
                this.submitting = false;
                if (res.status === 200) {
                    this.error = false;
                    this.success = true;
                    this.result = "Successfully triggered Order Notification API (HTTP Response Status = 200).";
                } else {
                    this.error = true;
                    this.success = false;
                    this.result = "HTTP Response Status = " + res.status + " (" + res.statusText + ")";
                }
            })
            .catch(error => {
                this.submitting = false;
                this.error = true;
                this.success = false;
                this.result = "HTTP Response Status = " + error.status + " (" + error.statusText + ")";
            });
    }
}

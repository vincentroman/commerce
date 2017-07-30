import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Comment } from "../../model/comment";
import { BrokerProductVariant } from "../../model/broker-product-variant";
import { Product } from "../../model/product";
import { ProductVariant } from "../../model/product-variant";
import { ProductService } from "../../service/product.service";
import { ProductVariantService } from "../../service/product-variant.service";
import { Broker } from "../../model/broker";
import { BrokerService } from "../../service/broker.service";

@Component({
    templateUrl: "./brokerproductvariant.component.html",
    providers: [
        BrokerService,
        ProductService,
        ProductVariantService
    ]
})
export class BrokerProductVariantEditComponent implements OnInit {
    submitting: boolean = false;
    error: boolean = false;
    productUuid: string = "";
    variantUuid: string = "";
    brokerUuid: string = "";
    entity: BrokerProductVariant = new BrokerProductVariant();
    broker: Broker = new Broker();
    product: Product = new Product();
    variant: ProductVariant = new ProductVariant();

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        private brokerService: BrokerService,
        private productService: ProductService,
        private productVariantService: ProductVariantService
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let productUuid: string = params["productUuid"];
            let variantUuid: string = params["variantUuid"];
            let brokerUuid: string = params["brokerUuid"];
            if (productUuid) {
                this.productUuid = productUuid;
            }
            if (variantUuid) {
                this.variantUuid = variantUuid;
            }
            if (brokerUuid) {
                this.brokerUuid = brokerUuid;
            }
        });
        this.productService.get(this.productUuid).then(product => this.product = product);
        this.brokerService.get(this.brokerUuid).then(broker => this.broker = broker);
        this.productVariantService.get(this.variantUuid).then(variant => this.variant = variant);
        this.productVariantService.getBrokerProductVariant(this.brokerUuid, this.variantUuid)
            .then(bpv => this.entity = bpv);
    }

    submit(): void {
        if (!this.entity.broker) {
            this.entity.broker = this.broker;
        }
        if (!this.entity.productVariant) {
            this.entity.productVariant = this.variant;
        }
        this.productVariantService.saveBrokerProductVariant(this.productUuid, this.entity).then((bpv) => {
            this.router.navigate(["/admin/products/edit", this.productUuid]);
        });
    }

    delete(): void {
        if (confirm("Delete this record?")) {
            if (!this.entity.broker) {
                this.entity.broker = this.broker;
            }
            if (!this.entity.productVariant) {
                this.entity.productVariant = this.variant;
            }
            this.entity.idForBroker = "";
            this.productVariantService.saveBrokerProductVariant(this.productUuid, this.entity).then((bpv) => {
                this.router.navigate(["/admin/products/edit", this.productUuid]);
            });
        }
    }
}

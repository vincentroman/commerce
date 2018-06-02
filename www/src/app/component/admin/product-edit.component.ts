import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "../entity-edit.component";
import { ProductService } from "../../service/product.service";
import { Product } from "../../model/product";
import { ProductVariant } from "../../model/product-variant";
import { Broker } from "../../model/broker";
import { BrokerService } from "../../service/broker.service";
import { ProductVariantService } from "../../service/product-variant.service";
import { BrokerProductVariant } from "../../model/broker-product-variant";

@Component({
    templateUrl: "./product-edit.component.html",
    providers: [
        ProductService,
        BrokerService,
        ProductVariantService
    ]
})
export class ProductEditComponent extends EntityEditComponent<Product> {
    brokers: Broker[] = [];
    variants: ProductVariant[] = [];
    brokerProductVariants: BrokerProductVariant[] = [];

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected productService: ProductService,
        private brokerService: BrokerService,
        private productVariantService: ProductVariantService
    ) {
        super(route, router, productService);
    }

    protected onInit(): void {
        if (this.uuid) {
            this.brokerService.list().then(brokers => this.brokers = brokers);
            this.productService.listVariantsForProduct(this.uuid).then(variants => this.variants = variants);
            this.productVariantService.getBrokerProductVariants(this.uuid).then(list => {
                this.brokerProductVariants = list;
            });
        }
    }

    public getIdForBroker(brokerUuid: string, productVariantUuid: string): string {
        let result: string = "";
        this.brokerProductVariants.forEach(bpv => {
            if (bpv.broker.uuid === brokerUuid && bpv.productVariant.uuid === productVariantUuid) {
                result = bpv.idForBroker;
            }
        });
        return result;
    }

    public getBrokerByUuid(uuid: string): Broker {
        let result: Broker = null;
        this.brokers.forEach(broker => {
            if (broker.uuid === uuid) {
                result = broker;
            }
        });
        return result;
    }

    public getProductVariantByUuid(uuid: string): ProductVariant {
        let result: ProductVariant = null;
        this.variants.forEach(variant => {
            if (variant.uuid === uuid) {
                result = variant;
            }
        });
        return result;
    }

    private updateBrokerProductVariant(bpvNew: BrokerProductVariant): void {
        let updated = false;
        this.brokerProductVariants.forEach((bpv, i) => {
            if (bpv.broker.uuid === bpvNew.broker.uuid && bpv.productVariant.uuid === bpvNew.productVariant.uuid) {
                this.brokerProductVariants[i] = bpvNew;
                updated = true;
            }
        });
        if (!updated) {
            this.brokerProductVariants.push(bpvNew);
        }
    }

    protected newTypeInstance(): Product {
        return new Product();
    }

    protected getListPath(): string {
        return "/admin/products";
    }
}

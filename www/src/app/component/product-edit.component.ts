import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "./entity-edit.component";
import { ProductService } from "../service/product.service";
import { Product } from "../model/product";
import { ProductVariant } from "../model/product-variant";
import { Broker } from "../model/broker";
import { BrokerService } from "../service/broker.service";
import { ProductVariantService } from "../service/product-variant.service";
import { BrokerProductVariant } from "../model/broker-product-variant";

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
    bpvEditMode = {
        brokerUuid: "",
        variantUuid: ""
    };

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
        this.brokerService.list().then(brokers => this.brokers = brokers);
        this.productVariantService.listForProduct(this.uuid).then(variants => this.variants = variants);
        this.productVariantService.getBrokerProductVariants(this.uuid).then(list => {
            this.brokerProductVariants = list;
        });
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
        this.brokerProductVariants.forEach((bpv, i) => {
            if (bpv.broker.uuid === bpvNew.broker.uuid && bpv.productVariant.uuid === bpvNew.productVariant.uuid) {
                this.brokerProductVariants[i] = bpvNew;
            }
        });
    }

    public saveIdForBroker(brokerUuid: string, productVariantUuid: string, event: any): void {
        let idForBroker: string = event.target.value;
        let bpv: BrokerProductVariant = new BrokerProductVariant();
        bpv.broker = this.getBrokerByUuid(brokerUuid);
        bpv.productVariant = this.getProductVariantByUuid(productVariantUuid);
        bpv.idForBroker = idForBroker.trim();
        this.productVariantService.saveBrokerProductVariant(this.uuid, bpv).then((bpv) => {
            this.bpvEditMode.brokerUuid = "";
            this.bpvEditMode.variantUuid = "";
            this.updateBrokerProductVariant(bpv);
        });
    }

    public isEditModeActive(brokerUuid: string, productVariantUuid: string): boolean {
        return this.bpvEditMode.brokerUuid === brokerUuid && this.bpvEditMode.variantUuid === productVariantUuid;
    }

    public enableEditMode(brokerUuid: string, productVariantUuid: string): void {
        this.bpvEditMode.brokerUuid = brokerUuid;
        this.bpvEditMode.variantUuid = productVariantUuid;
        window.setTimeout(function() {
            document.getElementById("edit-" + brokerUuid + "-" + productVariantUuid).focus();
        }, 100);
    }

    protected newTypeInstance(): Product {
        return new Product();
    }

    protected getListPath(): string {
        return "/products";
    }
}

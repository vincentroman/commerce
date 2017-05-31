import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "./entity-edit.component";
import { ProductService } from "../service/product.service";
import { Product } from "../model/product";
import { ProductVariant } from "../model/product-variant";
import { Broker } from "../model/broker";
import { BrokerService } from "../service/broker.service";
import { ProductVariantService } from "../service/product-variant.service";

@Component({
    templateUrl: "./product-edit.component.html",
    providers: [
        ProductService,
        BrokerService,
        ProductVariantService
    ]
})
export class ProductEditComponent extends EntityEditComponent<Product> implements OnInit {
    brokers: Broker[] = [];
    variants: ProductVariant[] = [];

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected productService: ProductService,
        private brokerService: BrokerService,
        private productVariantService: ProductVariantService
    ) {
        super(route, router, productService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.brokerService.list().then(brokers => this.brokers = brokers);
        this.productVariantService.list().then(variants => this.variants = variants);
    }

    protected newTypeInstance(): Product {
        return new Product();
    }

    protected getListPath(): string {
        return "/products";
    }
}

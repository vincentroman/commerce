import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProductService } from "../service/product.service";
import { Product } from "../model/product";
import { ProductVariant } from "../model/product-variant";
import { ProductVariantService } from "../service/product-variant.service";
import { Broker } from "../model/broker";
import { BrokerProductVariant } from "../model/broker-product-variant";

@Component({
    templateUrl: "./purchase.component.html",
    providers: [
        ProductService,
        ProductVariantService
    ]
})
export class PurchaseComponent implements OnInit {
    products: Product[] = [];
    variants: ProductVariant[] = [];
    brokerProductVariants: BrokerProductVariant[] = [];
    selectedProduct: Product = null;
    selectedTypes: number[] = null;
    selectedVariant: ProductVariant = null;
    selectedBroker: Broker = null;

    constructor(
        private router: Router,
        private productService: ProductService,
        private productVariantService: ProductVariantService
    ) {}

    ngOnInit(): void {
        this.productService.list().then(products => this.products = products);
    }

    selectProduct(product: Product): void {
        this.productVariantService.listForProduct(product.uuid).then(variants => this.variants = variants);
        this.selectedProduct = product;
        this.selectedTypes = null;
        this.selectedVariant = null;
        this.selectedBroker = null;
    }

    selectType(types: number[]): void {
        this.selectedTypes = types;
        this.selectedVariant = null;
        this.selectedBroker = null;
    }

    selectVariant(variant: ProductVariant): void {
        this.productVariantService.getBrokerProductVariants(this.selectedProduct.uuid).then(bpvs => this.brokerProductVariants = bpvs);
        this.selectedVariant = variant;
        this.selectedBroker = null;
    }

    selectBroker(broker: Broker): void {
        this.selectedBroker = broker;
        this.brokerProductVariants.forEach(bpv => {
            if (bpv.broker.uuid === broker.uuid) {
                window.open(bpv.url);
            }
        });
    }

    matchingVariants(): ProductVariant[] {
        return this.variants.filter(variant => this.selectedTypes.indexOf(variant.type) > -1);
    }

    matchingBrokers(): Broker[] {
        return this.brokerProductVariants.filter(bpv => {
            return (bpv.url);
        }).map(bpv => bpv.broker);
    }
}

import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProductService } from "../service/product.service";
import { Product } from "../model/product";
import { ProductVariant } from "../model/product-variant";
import { ProductVariantService } from "../service/product-variant.service";
import { Broker } from "../model/broker";
import { BrokerService } from "../service/broker.service";

@Component({
    templateUrl: "./purchase.component.html",
    providers: [
        ProductService,
        ProductVariantService,
        BrokerService
    ]
})
export class PurchaseComponent implements OnInit {
    products: Product[] = [];
    variants: ProductVariant[] = [];
    brokers: Broker[] = [];
    selectedProduct: Product = null;
    selectedTypes: number[] = null;
    selectedVariant: ProductVariant = null;

    constructor(
        private router: Router,
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private brokerService: BrokerService
    ) {}

    ngOnInit(): void {
        this.productService.list().then(products => this.products = products);
        //this.brokerService.list().then(brokers => this.brokers = brokers);
    }

    selectProduct(product: Product): void {
        this.productVariantService.listForProduct(product.uuid).then(variants => this.variants = variants);
        this.selectedProduct = product;
        this.selectedTypes = null;
        this.selectedVariant = null;
    }

    selectType(types: number[]): void {
        this.selectedTypes = types;
        this.selectedVariant = null;
    }

    selectVariant(variant: ProductVariant): void {
        this.selectedVariant = variant;
    }

    matchingVariants(): ProductVariant[] {
        return this.variants.filter(variant => this.selectedTypes.indexOf(variant.type) > -1);
    }

    matchingBrokers(): Broker[] {
        return this.brokers.filter(broker => {
            return true; // TODO
        });
    }
}

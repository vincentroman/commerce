import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { EntityEditComponent } from "./entity-edit.component";
import { ProductVariant } from "../model/product-variant";
import { ProductVariantService } from "../service/product-variant.service";
import { ProductService } from "../service/product.service";
import { Product } from "../model/product";

@Component({
    templateUrl: "./product-variant-edit.component.html",
    providers: [
        ProductVariantService,
        ProductService
    ]
})
export class ProductVariantEditComponent extends EntityEditComponent<ProductVariant> implements OnInit {
    product: Product = new Product();

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected productVariantService: ProductVariantService,
        private productService: ProductService
    ) {
        super(route, router, productVariantService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.route.params.forEach((params: Params) => {
            let productUuid: string = params["productUuid"];
            if (productUuid) {
                this.productService.get(productUuid).then(product => this.product = product);
            }
        });
    }

    protected newTypeInstance(): ProductVariant {
        return new ProductVariant();
    }

    protected getListPath(): string {
        return "/products/edit/" + this.product.uuid;
    }
}

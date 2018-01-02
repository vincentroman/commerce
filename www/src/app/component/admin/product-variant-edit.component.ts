import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { EntityEditComponent } from "../entity-edit.component";
import { ProductVariant } from "../../model/product-variant";
import { ProductVariantService } from "../../service/product-variant.service";
import { ProductService } from "../../service/product.service";
import { Product } from "../../model/product";

@Component({
    templateUrl: "./product-variant-edit.component.html",
    providers: [
        ProductVariantService,
        ProductService
    ]
})
export class ProductVariantEditComponent extends EntityEditComponent<ProductVariant> implements OnInit {
    product: Product = new Product();
    productUuid: string = "";

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected productVariantService: ProductVariantService,
        private productService: ProductService
    ) {
        super(route, router, productVariantService);
    }

    protected onInit(): void {
        this.route.params.forEach((params: Params) => {
            let productUuid: string = params["productUuid"];
            if (productUuid) {
                this.productUuid = productUuid;
                this.productService.get(productUuid).then(product => this.product = product);
            }
        });
    }

    protected newTypeInstance(): ProductVariant {
        let pv: ProductVariant = new ProductVariant();
        pv.product = new Product();
        pv.product.uuid = this.productUuid;
        return pv;
    }

    protected getListPath(): string {
        return "/admin/products/edit/" + this.product.uuid;
    }

    protected onEntityLoaded(): void {
        this.entity.product.uuid = this.productUuid;
    }
}

import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EntityListComponent } from "./entity-list.component";
import { Product } from "../model/product";
import { ProductService } from "../service/product.service";

@Component({
    templateUrl: "./product-list.component.html",
    providers: [
        ProductService
    ]
})
export class ProductListComponent extends EntityListComponent<Product> {
    constructor(
        protected router: Router,
        protected productService: ProductService
    ) {
        super(router, productService);
    }

    protected getEditPath(): string {
        return "/products/edit";
    }
}

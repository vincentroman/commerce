import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EntityEditComponent } from "./entity-edit.component";
import { ProductService } from "../service/product.service";
import { Product } from "../model/product";

@Component({
    templateUrl: "./product-edit.component.html",
    providers: [
        ProductService
    ]
})
export class ProductEditComponent extends EntityEditComponent<Product> {
    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected productService: ProductService
    ) {
        super(route, router, productService);
    }

    protected newTypeInstance(): Product {
        return new Product();
    }

    protected getListPath(): string {
        return "/products";
    }
}

import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { ProductVariant } from "../entity/ProductVariant";
import { Product } from "../entity/Product";

@Service()
export class ProductVariantDao extends Dao<ProductVariant> {
    protected getRepository(): Repository<ProductVariant> {
        return this.getEm().getRepository(ProductVariant);
    }

    public async getAllForProduct(product: Product): Promise<ProductVariant[]> {
        return this.getRepository()
            .createQueryBuilder("pv")
            .innerJoinAndSelect("pv.product", "product")
            .where("product.id = :id")
            .orderBy("pv.title", "ASC")
            .setParameters({id: product.id})
            .getMany();
    }
}

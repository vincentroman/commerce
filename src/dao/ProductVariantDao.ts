import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { ProductVariant } from "../entity/ProductVariant";

@Service()
export class ProductVariantDao extends Dao<ProductVariant> {
    protected getRepository(): Repository<ProductVariant> {
        return this.getEm().getRepository(ProductVariant);
    }
}

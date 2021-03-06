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

    protected allowPhysicalDelete(o: ProductVariant): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(false));
    }

    public async getByUuid(uuid: string): Promise<ProductVariant> {
        return this.getRepository()
            .createQueryBuilder("pv")
            .innerJoinAndSelect("pv.product", "product")
            .where("pv.uuid = :uuid")
            .andWhere("pv.deleted != 1")
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async getAll(maxResults?: number, skipNumResults?: number): Promise<ProductVariant[]> {
        return this.getManyWithLimits(this.getRepository()
            .createQueryBuilder("pv")
            .innerJoinAndSelect("pv.product", "product")
            .where("pv.deleted != 1")
            .orderBy("pv.title", "ASC"),
            maxResults, skipNumResults);
    }

    public async getAllForProduct(product: Product): Promise<ProductVariant[]> {
        return this.getRepository()
            .createQueryBuilder("pv")
            .innerJoinAndSelect("pv.product", "product")
            .where("product.id = :id")
            .andWhere("pv.deleted != 1")
            .orderBy("pv.title", "ASC")
            .setParameters({id: product.id})
            .getMany();
    }
}

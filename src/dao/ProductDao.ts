import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Product } from "../entity/Product";

@Service()
export class ProductDao extends Dao<Product> {
    protected getRepository(): Repository<Product> {
        return this.getEm().getRepository(Product);
    }

    protected allowPhysicalDelete(o: Product): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(false));
    }

    public async getAll(maxResults?: number, skipNumResults?: number): Promise<Product[]> {
        return this.getManyWithLimits(this.getRepository()
            .createQueryBuilder("p")
            .where("p.deleted != 1")
            .orderBy("p.title", "ASC"),
            maxResults, skipNumResults);
    }
}

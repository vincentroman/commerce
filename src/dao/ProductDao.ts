import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Product } from "../entity/Product";

@Service()
export class ProductDao extends Dao<Product> {
    protected getRepository(): Repository<Product> {
        return this.getEm().getRepository(Product);
    }
}
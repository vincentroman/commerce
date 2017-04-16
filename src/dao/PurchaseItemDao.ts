import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { PurchaseItem } from "../entity/PurchaseItem";

@Service()
export class PurchaseItemDao extends Dao<PurchaseItem> {
    protected getRepository(): Repository<PurchaseItem> {
        return this.getEm().getRepository(PurchaseItem);
    }
}

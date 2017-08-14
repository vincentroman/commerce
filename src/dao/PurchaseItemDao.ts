import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { PurchaseItem } from "../entity/PurchaseItem";
import { Purchase } from "../entity/Purchase";

@Service()
export class PurchaseItemDao extends Dao<PurchaseItem> {
    protected getRepository(): Repository<PurchaseItem> {
        return this.getEm().getRepository(PurchaseItem);
    }

    protected allowPhysicalDelete(o: PurchaseItem): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(false));
    }

    public getByPurchase(purchase: Purchase): Promise<PurchaseItem[]> {
        return this.getRepository()
            .createQueryBuilder("pi")
            .innerJoinAndSelect("pi.purchase", "purchase")
            .innerJoinAndSelect("pi.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .where("purchase.id = :id")
            .andWhere("pi.deleted != 1")
            .orderBy("product.title", "ASC")
            .addOrderBy("productVariant.title", "ASC")
            .setParameters({id: purchase.id})
            .getMany();
    }
}

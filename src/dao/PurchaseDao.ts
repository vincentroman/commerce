import { Repository } from "typeorm";
import { Service } from "typedi";
import { Container } from "typedi";
import { Dao } from "./Dao";
import { PurchaseItemDao } from "./PurchaseItemDao";
import { Purchase } from "../entity/Purchase";
import { PurchaseItem } from "../entity/PurchaseItem";

@Service()
export class PurchaseDao extends Dao<Purchase> {
    protected getRepository(): Repository<Purchase> {
        return this.getEm().getRepository(Purchase);
    }

    protected allowPhysicalDelete(o: Purchase): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(false));
    }

    public async getAll(maxResults?: number, skipNumResults?: number): Promise<Purchase[]> {
        return this.getManyWithLimits(this.getRepository()
            .createQueryBuilder("order")
            .innerJoinAndSelect("order.broker", "broker")
            .leftJoinAndSelect("order.items", "items")
            .leftJoinAndSelect("order.customer", "customer")
            .leftJoinAndSelect("items.productVariant", "productVariant")
            .leftJoinAndSelect("productVariant.product", "product")
            .where("order.deleted != 1")
            .orderBy("order.createDate", "DESC"),
            maxResults, skipNumResults);
    }

    public async getByUuid(uuid: string): Promise<Purchase> {
        return this.getRepository()
            .createQueryBuilder("order")
            .innerJoinAndSelect("order.broker", "broker")
            .leftJoinAndSelect("order.items", "items")
            .leftJoinAndSelect("order.customer", "customer")
            .leftJoinAndSelect("items.productVariant", "productVariant")
            .leftJoinAndSelect("productVariant.product", "product")
            .where("order.uuid = :uuid")
            .andWhere("order.deleted != 1")
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async removeAll(): Promise<void> {
        return Container.get(PurchaseItemDao).removeAll().then(() => {
            return super.removeAll();
        });
    }
}

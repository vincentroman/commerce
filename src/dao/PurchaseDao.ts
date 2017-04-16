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

    public async getByUuid(uuid: string): Promise<Purchase> {
        return this.getRepository()
            .createQueryBuilder("order")
            .innerJoinAndSelect("order.broker", "broker")
            .leftJoinAndSelect("order.items", "items")
            .leftJoinAndSelect("items.productVariant", "productVariant")
            .leftJoinAndSelect("productVariant.product", "product")
            .where("order.uuid = :uuid")
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async removeAll(): Promise<void> {
        return Container.get(PurchaseItemDao).removeAll().then(() => {
            return super.removeAll();
        });
    }
}

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

    public async getAll(maxResults?: number, skipNumResults?: number, search?: string): Promise<Purchase[]> {
        let query = this.getRepository()
            .createQueryBuilder("order")
            .innerJoinAndSelect("order.broker", "broker")
            .leftJoinAndSelect("order.items", "items")
            .leftJoinAndSelect("order.customer", "customer")
            .leftJoinAndSelect("items.productVariant", "productVariant")
            .leftJoinAndSelect("productVariant.product", "product")
            .where("order.deleted != 1")
            .orderBy("order.createDate", "DESC");
        if (search) {
            query = query.andWhere("(customer.firstname LIKE :keyword OR " +
                "customer.lastname LIKE :keyword OR " +
                "customer.company LIKE :keyword OR " +
                "customer.email LIKE :keyword)");
            query = query.setParameters({keyword: "%" + search + "%"});
        }
        return this.getManyWithLimits(query, maxResults, skipNumResults);
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

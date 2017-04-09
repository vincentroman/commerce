import { Repository } from "typeorm";
import { Service } from "typedi";
import { Container } from "typedi";
import { Dao } from "./Dao";
import { OrderItemDao } from "./OrderItemDao";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";

@Service()
export class OrderDao extends Dao<Order> {
    protected getRepository(): Repository<Order> {
        return this.getEm().getRepository(Order);
    }

    public async getByUuid(uuid: string): Promise<Order> {
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
        return Container.get(OrderItemDao).removeAll().then(() => {
            return super.removeAll();
        });
    }
}

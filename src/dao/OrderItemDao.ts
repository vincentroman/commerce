import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { OrderItem } from "../entity/OrderItem";

@Service()
export class OrderItemDao extends Dao<OrderItem> {
    protected getRepository(): Repository<OrderItem> {
        return this.getEm().getRepository(OrderItem);
    }
}

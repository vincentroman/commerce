import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Order } from "../entity/Order";

@Service()
export class OrderDao extends Dao<Order> {
    protected getRepository(): Repository<Order> {
        return this.getEm().getRepository(Order);
    }
}

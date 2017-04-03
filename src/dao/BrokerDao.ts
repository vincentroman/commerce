import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Broker } from "../entity/Broker";

@Service()
export class BrokerDao extends Dao<Broker> {
    protected getRepository(): Repository<Broker> {
        return this.getEm().getRepository(Broker);
    }
}

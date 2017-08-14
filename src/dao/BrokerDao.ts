import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Broker } from "../entity/Broker";

@Service()
export class BrokerDao extends Dao<Broker> {
    protected getRepository(): Repository<Broker> {
        return this.getEm().getRepository(Broker);
    }

    protected allowPhysicalDelete(o: Broker): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(false));
    }

    public async getAll(): Promise<Broker[]> {
        return this.getRepository()
            .createQueryBuilder("e")
            .where("e.deleted != 1")
            .orderBy("e.name")
            .getMany();
    }
}

import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Broker } from "../entity/Broker";
import { BrokerProductVariant } from "../entity/BrokerProductVariant";
import { ProductVariant } from "../entity/ProductVariant";

@Service()
export class BrokerProductVariantDao extends Dao<BrokerProductVariant> {
    protected getRepository(): Repository<BrokerProductVariant> {
        return this.getEm().getRepository(BrokerProductVariant);
    }

    public async getByBrokerProductVariant(broker: Broker, productVariant: ProductVariant): Promise<BrokerProductVariant> {
        return this.getRepository().findOne({
            "broker.id": broker.id,
            "productVariant.id": productVariant.id
        });
    }

    public async getByBrokerId(broker: Broker, id: string): Promise<BrokerProductVariant> {
        return this.getRepository()
            .createQueryBuilder("bpv")
            .innerJoinAndSelect("bpv.broker", "broker")
            .innerJoinAndSelect("bpv.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .where("bpv.idForBroker = :id")
            .andWhere("broker.id = :brokerId")
            .setParameters({id: id, brokerId: broker.id})
            .getOne();
    }

    public async add(broker: Broker, productVariant: ProductVariant, idForBroker: string): Promise<BrokerProductVariant> {
        let bpv: BrokerProductVariant = new BrokerProductVariant();
        bpv.broker = broker;
        bpv.productVariant = productVariant;
        bpv.idForBroker = idForBroker;
        return this.save(bpv);
    }
}

import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Broker } from "../entity/Broker";
import { BrokerProductVariant } from "../entity/BrokerProductVariant";
import { ProductVariant } from "../entity/ProductVariant";
import { Product } from "../entity/Product";

@Service()
export class BrokerProductVariantDao extends Dao<BrokerProductVariant> {
    protected getRepository(): Repository<BrokerProductVariant> {
        return this.getEm().getRepository(BrokerProductVariant);
    }

    protected allowPhysicalDelete(o: BrokerProductVariant): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(false));
    }

    public async getAllWithUrl(): Promise<BrokerProductVariant[]> {
        return this.getRepository()
            .createQueryBuilder("bpv")
            .innerJoinAndSelect("bpv.broker", "broker")
            .innerJoinAndSelect("bpv.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .where("bpv.deleted != 1")
            .andWhere("bpv.url IS NOT NULL")
            .andWhere("bpv.url != ''")
            .orderBy("product.title", "ASC")
            .addOrderBy("productVariant.title", "ASC")
            .addOrderBy("broker.name", "ASC")
            .getMany();
    }

    public async getByBrokerProductVariant(broker: Broker, productVariant: ProductVariant): Promise<BrokerProductVariant> {
        return this.getRepository()
            .createQueryBuilder("bpv")
            .innerJoinAndSelect("bpv.broker", "broker")
            .innerJoinAndSelect("bpv.productVariant", "productVariant")
            .where("broker.id = :brokerId")
            .andWhere("productVariant.id = :productVariantId")
            .andWhere("bpv.deleted != 1")
            .setParameters({brokerId: broker.id, productVariantId: productVariant.id})
            .getOne();
    }

    public async getByBrokerId(broker: Broker, id: string): Promise<BrokerProductVariant> {
        return this.getRepository()
            .createQueryBuilder("bpv")
            .innerJoinAndSelect("bpv.broker", "broker")
            .innerJoinAndSelect("bpv.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .where("bpv.idForBroker = :id")
            .andWhere("broker.id = :brokerId")
            .andWhere("bpv.deleted != 1")
            .setParameters({id: id, brokerId: broker.id})
            .getOne();
    }

    public async getByProduct(product: Product): Promise<BrokerProductVariant[]> {
        return this.getRepository()
            .createQueryBuilder("bpv")
            .innerJoinAndSelect("bpv.broker", "broker")
            .innerJoinAndSelect("bpv.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .where("product.id = :id")
            .andWhere("bpv.deleted != 1")
            .orderBy("productVariant.title", "ASC")
            .addOrderBy("broker.name", "ASC")
            .setParameters({id: product.id})
            .getMany();
    }

    public async addOrReplace(broker: Broker, productVariant: ProductVariant, idForBroker: string): Promise<BrokerProductVariant> {
        let bpv: BrokerProductVariant = await this.getByBrokerProductVariant(broker, productVariant);
        if (!idForBroker) {
            if (bpv) {
                await this.delete(bpv);
            }
            return null;
        }
        if (!bpv) {
            bpv = new BrokerProductVariant();
        }
        bpv.broker = broker;
        bpv.productVariant = productVariant;
        bpv.idForBroker = idForBroker;
        return this.save(bpv);
    }
}

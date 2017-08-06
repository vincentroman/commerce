import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { SupportTicket, SupportRequestStatus } from "../entity/SupportTicket";

@Service()
export class SupportTicketDao extends Dao<SupportTicket> {
    protected getRepository(): Repository<SupportTicket> {
        return this.getEm().getRepository(SupportTicket);
    }

    public async getByUuid(uuid: string): Promise<SupportTicket> {
        return this.getRepository()
            .createQueryBuilder("st")
            .innerJoinAndSelect("st.customer", "customer")
            .innerJoinAndSelect("st.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .leftJoinAndSelect("st.purchaseItem", "purchaseItem")
            .where("st.uuid = :uuid")
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async getAll(): Promise<SupportTicket[]> {
        return this.getRepository()
            .createQueryBuilder("st")
            .innerJoinAndSelect("st.customer", "customer")
            .innerJoinAndSelect("st.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .leftJoinAndSelect("st.purchaseItem", "purchaseItem")
            .orderBy("st.createDate", "DESC")
            .addOrderBy("st.sendDate", "DESC")
            .getMany();
    }

    public async getAllCustometTickets(customerUuid: string): Promise<SupportTicket[]> {
        return this.getRepository()
            .createQueryBuilder("st")
            .innerJoinAndSelect("st.customer", "customer")
            .innerJoinAndSelect("st.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .leftJoinAndSelect("st.purchaseItem", "purchaseItem")
            .where("customer.uuid = :customerUuid")
            .orderBy("st.createDate", "DESC")
            .addOrderBy("st.sendDate", "DESC")
            .setParameters({customerUuid: customerUuid})
            .getMany();
    }

    public async getAllUnclosedTickets(customerUuid: string): Promise<SupportTicket[]> {
        return this.getRepository()
            .createQueryBuilder("st")
            .innerJoinAndSelect("st.customer", "customer")
            .innerJoinAndSelect("st.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .leftJoinAndSelect("st.purchaseItem", "purchaseItem")
            .where("customer.uuid = :customerUuid")
            .andWhere("st.status != " + SupportRequestStatus.CLOSED)
            .orderBy("st.createDate", "DESC")
            .addOrderBy("st.sendDate", "DESC")
            .setParameters({customerUuid: customerUuid})
            .getMany();
    }
}

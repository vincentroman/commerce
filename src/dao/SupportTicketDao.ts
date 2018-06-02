import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { SupportTicket, SupportRequestStatus } from "../entity/SupportTicket";

@Service()
export class SupportTicketDao extends Dao<SupportTicket> {
    protected getRepository(): Repository<SupportTicket> {
        return this.getEm().getRepository(SupportTicket);
    }

    protected allowPhysicalDelete(o: SupportTicket): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(true));
    }

    public async getByUuid(uuid: string): Promise<SupportTicket> {
        return this.getRepository()
            .createQueryBuilder("st")
            .innerJoinAndSelect("st.customer", "customer")
            .innerJoinAndSelect("st.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .leftJoinAndSelect("st.purchaseItem", "purchaseItem")
            .where("st.uuid = :uuid")
            .andWhere("st.deleted != 1")
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async getAll(maxResults?: number, skipNumResults?: number, search?: string): Promise<SupportTicket[]> {
        let query = this.getRepository()
            .createQueryBuilder("st")
            .innerJoinAndSelect("st.customer", "customer")
            .innerJoinAndSelect("st.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .leftJoinAndSelect("st.purchaseItem", "purchaseItem")
            .where("st.deleted != 1")
            .orderBy("st.createDate", "DESC")
            .addOrderBy("st.sendDate", "DESC");
        if (search) {
            query = query.andWhere("(customer.firstname LIKE :keyword OR " +
                "customer.lastname LIKE :keyword OR " +
                "customer.company LIKE :keyword OR " +
                "customer.email LIKE :keyword)");
            query = query.setParameters({keyword: "%" + search + "%"});
        }
        return this.getManyWithLimits(query, maxResults, skipNumResults);
    }

    public async getAllCustomerTickets(customerUuid: string, maxResults?: number, skipNumResults?: number): Promise<SupportTicket[]> {
        return this.getManyWithLimits(this.getRepository()
            .createQueryBuilder("st")
            .innerJoinAndSelect("st.customer", "customer")
            .innerJoinAndSelect("st.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .leftJoinAndSelect("st.purchaseItem", "purchaseItem")
            .where("customer.uuid = :customerUuid")
            .andWhere("st.deleted != 1")
            .orderBy("st.createDate", "DESC")
            .addOrderBy("st.sendDate", "DESC")
            .setParameters({customerUuid: customerUuid}),
            maxResults, skipNumResults);
    }

    public async getAllUnclosedTickets(customerUuid?: string): Promise<SupportTicket[]> {
        let query = this.getRepository()
            .createQueryBuilder("st")
            .innerJoinAndSelect("st.customer", "customer")
            .innerJoinAndSelect("st.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .leftJoinAndSelect("st.purchaseItem", "purchaseItem")
            .where("st.status != " + SupportRequestStatus.CLOSED)
            .andWhere("st.deleted != 1");
        if (customerUuid !== undefined) {
            query = query.andWhere("customer.uuid = :customerUuid")
                .setParameters({customerUuid: customerUuid});
        }
        return query.andWhere("st.status != " + SupportRequestStatus.CLOSED)
            .orderBy("st.createDate", "DESC")
            .addOrderBy("st.sendDate", "DESC")
            .getMany();
    }
}

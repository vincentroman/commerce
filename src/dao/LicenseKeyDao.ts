import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { LicenseKey } from "../entity/LicenseKey";

@Service()
export class LicenseKeyDao extends Dao<LicenseKey> {
    protected getRepository(): Repository<LicenseKey> {
        return this.getEm().getRepository(LicenseKey);
    }

    protected allowPhysicalDelete(o: LicenseKey): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(true));
    }

    public async getByUuid(uuid: string): Promise<LicenseKey> {
        return this.getRepository()
            .createQueryBuilder("lk")
            .innerJoinAndSelect("lk.customer", "customer")
            .innerJoinAndSelect("lk.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .orderBy("lk.createDate", "DESC")
            .addOrderBy("lk.issueDate", "DESC")
            .where("lk.uuid = :uuid")
            .andWhere("lk.deleted != 1")
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async getAll(maxResults?: number, skipNumResults?: number, search?: string): Promise<LicenseKey[]> {
        let query = this.getRepository()
            .createQueryBuilder("lk")
            .innerJoinAndSelect("lk.customer", "customer")
            .innerJoinAndSelect("lk.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .where("lk.deleted != 1")
            .orderBy("lk.createDate", "DESC")
            .addOrderBy("lk.issueDate", "DESC");
        if (search) {
            query = query.andWhere("(customer.firstname LIKE :keyword OR " +
                "customer.lastname LIKE :keyword OR " +
                "customer.company LIKE :keyword OR " +
                "customer.email LIKE :keyword)");
            query = query.setParameters({keyword: "%" + search + "%"});
        }
        return this.getManyWithLimits(query, maxResults, skipNumResults);
    }

    public async getAllCustomerLicenses(customerUuid: string, maxResults?: number, skipNumResults?: number): Promise<LicenseKey[]> {
        return this.getManyWithLimits(this.getRepository()
            .createQueryBuilder("lk")
            .innerJoinAndSelect("lk.customer", "customer")
            .innerJoinAndSelect("lk.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .where("customer.uuid = :customerUuid")
            .andWhere("lk.deleted != 1")
            .orderBy("lk.createDate", "DESC")
            .addOrderBy("lk.issueDate", "DESC")
            .setParameters({customerUuid: customerUuid}),
            maxResults, skipNumResults);
    }
}

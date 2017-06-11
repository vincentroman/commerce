import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { LicenseKey } from "../entity/LicenseKey";

@Service()
export class LicenseKeyDao extends Dao<LicenseKey> {
    protected getRepository(): Repository<LicenseKey> {
        return this.getEm().getRepository(LicenseKey);
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
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async getAll(): Promise<LicenseKey[]> {
        return this.getRepository()
            .createQueryBuilder("lk")
            .innerJoinAndSelect("lk.customer", "customer")
            .innerJoinAndSelect("lk.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .orderBy("lk.createDate", "DESC")
            .addOrderBy("lk.issueDate", "DESC")
            .getMany();
    }

    public async getAllCustomerLicenses(customerUuid: string): Promise<LicenseKey[]> {
        return this.getRepository()
            .createQueryBuilder("lk")
            .innerJoinAndSelect("lk.customer", "customer")
            .innerJoinAndSelect("lk.productVariant", "productVariant")
            .innerJoinAndSelect("productVariant.product", "product")
            .where("customer.uuid = :customerUuid")
            .orderBy("lk.createDate", "DESC")
            .addOrderBy("lk.issueDate", "DESC")
            .setParameters({customerUuid: customerUuid})
            .getMany();
    }
}

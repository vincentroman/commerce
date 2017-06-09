import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Customer } from "../entity/Customer";

@Service()
export class CustomerDao extends Dao<Customer> {
    protected getRepository(): Repository<Customer> {
        return this.getEm().getRepository(Customer);
    }

    public async getByEmail(email: string): Promise<Customer> {
        return this.getRepository().findOne({email: email});
    }

    public async getSuggestions(keyword: string): Promise<Customer[]> {
        let query = this.getRepository()
            .createQueryBuilder("c")
            .orderBy("c.firstname", "ASC")
            .addOrderBy("c.lastname", "ASC")
            .addOrderBy("c.company", "ASC");
        if (keyword) {
            query = query.where("c.firstname LIKE :keyword");
            query = query.orWhere("c.lastname LIKE :keyword");
            query = query.orWhere("c.company LIKE :keyword");
            query = query.orWhere("c.email LIKE :keyword");
            query = query.setParameters({keyword: "%" + keyword + "%"});
        }
        return query.getMany();
    }
}

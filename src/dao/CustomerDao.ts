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
}

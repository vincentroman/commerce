import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { CustomerNote } from "../entity/CustomerNote";

@Service()
export class CustomerNoteDao extends Dao<CustomerNote> {
    protected getRepository(): Repository<CustomerNote> {
        return this.getEm().getRepository(CustomerNote);
    }
}

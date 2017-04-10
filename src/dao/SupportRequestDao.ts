import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { SupportRequest } from "../entity/SupportRequest";

@Service()
export class SupportRequestDao extends Dao<SupportRequest> {
    protected getRepository(): Repository<SupportRequest> {
        return this.getEm().getRepository(SupportRequest);
    }
}

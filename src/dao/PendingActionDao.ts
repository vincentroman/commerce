import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { PendingAction } from "../entity/PendingAction";

@Service()
export class PendingActionDao extends Dao<PendingAction> {
    protected getRepository(): Repository<PendingAction> {
        return this.getEm().getRepository(PendingAction);
    }
}

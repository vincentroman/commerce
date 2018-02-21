import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { PendingAction, ActionType } from "../entity/PendingAction";

@Service()
export class PendingActionDao extends Dao<PendingAction> {
    protected getRepository(): Repository<PendingAction> {
        return this.getEm().getRepository(PendingAction);
    }

    protected allowPhysicalDelete(o: PendingAction): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(true));
    }

    public async getLatest(type: ActionType): Promise<PendingAction> {
        return this.getRepository()
            .createQueryBuilder("a")
            .where("a.type = :type", {type: type})
            .orderBy("a.createDate", "DESC")
            .limit(1)
            .getOne();
    }
}

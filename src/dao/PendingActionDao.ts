import * as moment from "moment";
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

    public async getAllOfType(type: ActionType): Promise<PendingAction[]> {
        return this.getRepository()
            .createQueryBuilder("a")
            .where("a.type = :type", {type: type})
            .orderBy("a.createDate", "DESC")
            .addOrderBy("a.id", "DESC")
            .getMany();
    }

    public async deleteExpired(): Promise<number> {
        let today: string = moment()
            .hours(23).minutes(59).seconds(59)
            .format("YYYY-MM-DD HH:mm:ss");
        return this.getRepository()
            .createQueryBuilder("a")
            .where(this.getDateComparisonString("a.expiry", ":date"), {date: today})
            .getMany()
            .then(list => {
                let num = list.length;
                if (num > 0) {
                    return this
                        .getRepository()
                        .remove(list)
                        .then(() => {
                            return num;
                        });
                } else {
                    return 0;
                }
            });
    }

    public createResetPasswordAction(): PendingAction {
        let action: PendingAction = new PendingAction();
        action.type = ActionType.ResetPassword;
        action.expiry = moment().add(2, "days").toDate();
        return action;
    }

    public createChangeEmailAction(): PendingAction {
        let action: PendingAction = new PendingAction();
        action.type = ActionType.ChangeEmail;
        action.expiry = moment().add(2, "days").toDate();
        return action;
    }

    public createConfirmOrderAction(): PendingAction {
        let action: PendingAction = new PendingAction();
        action.type = ActionType.ConfirmOrder;
        action.expiry = moment().add(7, "days").toDate();
        return action;
    }
}

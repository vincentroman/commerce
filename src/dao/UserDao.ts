import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { User } from "../entity/User";

@Service()
export class UserDao extends Dao<User> {
    protected getRepository(): Repository<User> {
        return this.getEm().getRepository(User);
    }

    public async getByEmail(email: string): Promise<User> {
        return this.getRepository().findOne({email: email});
    }

    public async getAdmins(): Promise<User[]> {
        return this.getRepository().find({roleAdmin: true});
    }
}

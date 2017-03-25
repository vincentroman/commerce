import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { User } from "../entity/User";

@Service()
export class UserDao extends Dao<User> {
    protected getRepository(): Repository<User> {
        return this.getEm().getRepository(User);
    }
}

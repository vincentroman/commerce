import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { User } from "../entity/User";

@Service()
export class UserDao extends Dao<User> {
    protected getRepository(): Repository<User> {
        return this.getEm().getRepository(User);
    }

    public async getByUuid(uuid: string): Promise<User> {
        return this.getRepository()
            .createQueryBuilder("u")
            .leftJoinAndSelect("u.customer", "customer")
            .where("u.uuid = :uuid")
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async getByEmail(email: string): Promise<User> {
        return this.getRepository()
            .createQueryBuilder("u")
            .leftJoinAndSelect("u.customer", "customer")
            .where("u.email = :email")
            .setParameters({email: email})
            .getOne();
    }

    public async getAdmins(): Promise<User[]> {
        return this.getRepository().find({roleAdmin: true});
    }
}

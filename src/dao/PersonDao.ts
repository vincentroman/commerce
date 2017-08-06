import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Person } from "../entity/Person";

@Service()
export class PersonDao extends Dao<Person> {
    protected getRepository(): Repository<Person> {
        return this.getEm().getRepository(Person);
    }

    public async getByEmail(email: string): Promise<Person> {
        return this.getRepository().findOne({email: email});
    }

    public async getAll(): Promise<Person[]> {
        return this.getRepository()
            .createQueryBuilder("p")
            .orderBy("p.firstname")
            .addOrderBy("p.lastname")
            .getMany();
    }

    public async getSuggestions(keyword: string): Promise<Person[]> {
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

    public async getAdmins(): Promise<Person[]> {
        return this.getRepository().find({roleAdmin: true});
    }
}

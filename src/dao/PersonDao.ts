import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Person } from "../entity/Person";

@Service()
export class PersonDao extends Dao<Person> {
    protected getRepository(): Repository<Person> {
        return this.getEm().getRepository(Person);
    }

    protected allowPhysicalDelete(o: Person): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(false));
    }

    public async getByEmail(email: string): Promise<Person> {
        return this.getRepository().findOne({email: email});
    }

    public async existsPerson(email: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getByEmail(email).then(person => {
                if (person === null || person === undefined) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch(reason => resolve(false));
        });
    }

    public async getAll(maxResults?: number, skipNumResults?: number, search?: string): Promise<Person[]> {
        let query = this.getRepository()
            .createQueryBuilder("p")
            .where("p.deleted != 1")
            .orderBy("p.firstname")
            .addOrderBy("p.lastname");
        if (search) {
            query = query.andWhere("(p.firstname LIKE :keyword OR " +
                "p.lastname LIKE :keyword OR " +
                "p.company LIKE :keyword OR " +
                "p.email LIKE :keyword)");
            query = query.setParameters({keyword: "%" + search + "%"});
        }
        return this.getManyWithLimits(query, maxResults, skipNumResults);
    }

    public async getSuggestions(keyword: string): Promise<Person[]> {
        let query = this.getRepository()
            .createQueryBuilder("c")
            .where("c.deleted != 1")
            .orderBy("c.firstname", "ASC")
            .addOrderBy("c.lastname", "ASC")
            .addOrderBy("c.company", "ASC");
        if (keyword) {
            query = query.andWhere("(c.firstname LIKE :keyword OR " +
                "c.lastname LIKE :keyword OR " +
                "c.company LIKE :keyword OR " +
                "c.email LIKE :keyword)");
            query = query.setParameters({keyword: "%" + keyword + "%"});
        }
        return query.getMany();
    }

    public async getAdmins(): Promise<Person[]> {
        return this.getRepository()
            .createQueryBuilder("p")
            .where("p.deleted != 1")
            .andWhere("p.roleAdmin = 1")
            .getMany();
    }
}

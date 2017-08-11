import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { TopLevelDomain } from "../entity/TopLevelDomain";

@Service()
export class TopLevelDomainDao extends Dao<TopLevelDomain> {
    protected getRepository(): Repository<TopLevelDomain> {
        return this.getEm().getRepository(TopLevelDomain);
    }

    public async getAll(): Promise<TopLevelDomain[]> {
        return this.getRepository()
            .createQueryBuilder("t")
            .orderBy("t.tld")
            .getMany();
    }

    public async getByTld(tld: string): Promise<TopLevelDomain> {
        return this.getRepository()
            .createQueryBuilder("t")
            .where("t.tld = :tld")
            .setParameters({tld: tld})
            .getOne();
    }

    public async insertIfNotExists(tld: string): Promise<TopLevelDomain> {
        return new Promise<TopLevelDomain>((resolve, reject) => {
            this.getByTld(tld).then(e => {
                if (e) {
                    resolve(e);
                } else {
                    let e: TopLevelDomain = new TopLevelDomain();
                    e.tld = tld;
                    this.save(e).then(e => resolve(e)).catch(e => reject(e));
                }
            }).catch(e => reject(e));
        });
    }
}

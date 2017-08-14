import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { TopLevelDomain } from "../entity/TopLevelDomain";

@Service()
export class TopLevelDomainDao extends Dao<TopLevelDomain> {
    protected getRepository(): Repository<TopLevelDomain> {
        return this.getEm().getRepository(TopLevelDomain);
    }

    protected allowPhysicalDelete(o: TopLevelDomain): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(true));
    }

    public async getAll(): Promise<TopLevelDomain[]> {
        return this.getRepository()
            .createQueryBuilder("t")
            .where("t.deleted != 1")
            .orderBy("t.tld")
            .getMany();
    }

    public async getByTld(tld: string): Promise<TopLevelDomain> {
        return this.getRepository()
            .createQueryBuilder("t")
            .where("t.tld = :tld")
            .andWhere("t.deleted != 1")
            .setParameters({tld: tld})
            .getOne();
    }

    public async isValidTld(tld: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getByTld(tld).then(e => {
                if (e) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(e => reject());
        });
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

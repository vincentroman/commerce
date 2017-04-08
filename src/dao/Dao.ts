import { getEntityManager, Repository, EntityManager } from "typeorm";
import * as uuid from 'uuid/v4';
import { DbEntity } from "../entity/DbEntity";

export abstract class Dao<T extends DbEntity> {
    public async getById(id: number): Promise<T> {
        return this.getRepository().findOneById(id);
    }

    public async getByUuid(uuid: string): Promise<T> {
        return this.getRepository().findOne({uuid: uuid});
    }

    public async getAll(): Promise<T[]> {
        return this.getRepository().find();
    }

    public async save(o: T): Promise<T> {
        if (!o.uuid) {
            o.uuid = uuid(); // TODO Check if exists
        }
        return this.getRepository().persist(o);
    }

    public async delete(o: T): Promise<T> {
        return this.getRepository().remove(o);
    }

    protected getEm(): EntityManager {
        return getEntityManager();
    }

    public async removeAll(): Promise<void> {
        return this.getRepository().clear();
    }

    protected abstract getRepository(): Repository<T>;
}

import { Repository, Connection, EntityManager } from "typeorm";
import * as uuid from 'uuid/v4';
import { DbEntity } from "../entity/DbEntity";
import { App } from "../App";

export abstract class Dao<T extends DbEntity<T>> {
    public async getById(id: number): Promise<T> {
        return this.getRepository()
            .createQueryBuilder("e")
            .where("e.id = :id")
            .andWhere("e.deleted != 1")
            .setParameters({id: id})
            .getOne();
    }

    public async getByUuid(uuid: string): Promise<T> {
        return this.getRepository()
            .createQueryBuilder("e")
            .where("e.uuid = :uuid")
            .andWhere("e.deleted != 1")
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async getAll(): Promise<T[]> {
        return this.getRepository()
            .createQueryBuilder("e")
            .where("e.deleted != 1")
            .getMany();
    }

    public async prepareSaveAll(oList: T[]): Promise<T[]> {
        for (let o of oList) {
            o = await this.assignUuid(o);
        }
        return oList;
        //return this.getRepository().save(oList);
    }

    public async save(o: T): Promise<T> {
        o = await this.assignUuid(o);
        return o.save();
    }

    private async assignUuid(o: T): Promise<T> {
        if (!o.uuid) {
            let id: string;
            let item: T;
            do {
                id = uuid();
                item = await this.getByUuid(id);
                if (item) {
                    id = null;
                }
            } while (!id);
            o.uuid = id;
        }
        return new Promise<T>((resolve, reject) => resolve(o));
    }

    public async delete(o: T): Promise<T> {
        return this.allowPhysicalDelete(o).then(allowDelete => {
            if (allowDelete) {
                return this.getRepository().remove(o);
            } else {
                o.deleted = true;
                return this.save(o);
            }
        });
    }

    protected getEm(): EntityManager {
        return this.getConnection().manager;
    }

    private getConnection(): Connection {
        return App.getInstance().dbConnection;
    }

    public async removeAll(): Promise<void> {
        return this.getRepository().clear();
    }

    protected abstract getRepository(): Repository<T>;

    protected abstract allowPhysicalDelete(o: T): Promise<boolean>;
}

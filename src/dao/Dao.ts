import { Repository, Connection, EntityManager, SelectQueryBuilder } from "typeorm";
import * as uuid from 'uuid/v4';
import { DbEntity } from "../entity/DbEntity";
import { App } from "../App";
import { Config } from "../util/Config";

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

    protected async getManyWithLimits(qb: SelectQueryBuilder<any>, maxResults?: number, skipNumResults?: number): Promise<T[]> {
        if (typeof maxResults === "undefined") {
            maxResults = 9999999;
        }
        if (typeof skipNumResults === "undefined") {
            skipNumResults = 0;
        }
        return qb.skip(skipNumResults).take(maxResults).getMany();
    }

    public async getAll(maxResults?: number, skipNumResults?: number, search?: string): Promise<T[]> {
        return this.getManyWithLimits(this.getRepository()
            .createQueryBuilder("e")
            .where("e.deleted != 1"),
            maxResults, skipNumResults);
    }

    public async prepareSaveAll(oList: T[]): Promise<T[]> {
        for (let o of oList) {
            o = await this.assignUuid(o);
        }
        return oList;
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


    protected getDateComparisonString(field: string, parameter: string): string {
        let config: any = Config.getInstance().get("database");
        let driver: string = config.driver.type.toLowerCase();
        if (driver === "sqlite") {
            return "DATETIME(" + field + ") <= DATETIME(" + parameter + ")";
        } else if (driver === "mysql" || driver === "mariadb") {
            return field + " <= STR_TO_DATE(" + parameter + ", '%Y-%m-%d %H:%i:%s')";
        } else if (driver === "mssql") {
            return field + " <= CONVERT(DATETIME, " + parameter + ", 120)";
        } else if (driver === "postgres" || driver === "oracle") {
            return field + " <= TO_DATE(" + parameter + ", 'YYYY-MM-DD HH24-MI-SS')";
        } else {
            return "UNSUPPORTED DATABASE DRIVER";
        }
    }

    protected abstract getRepository(): Repository<T>;

    protected abstract allowPhysicalDelete(o: T): Promise<boolean>;
}

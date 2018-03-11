import { Service } from "typedi";
import { Dao } from "./Dao";
import { LogEntry } from "../entity/LogEntry";
import { Repository } from "typeorm";

@Service()
export class LogEntryDao extends Dao<LogEntry> {
    protected getRepository(): Repository<LogEntry> {
        return this.getEm().getRepository(LogEntry);
    }

    protected allowPhysicalDelete(o: LogEntry): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(false));
    }
}

import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { LicenseKey } from "../entity/LicenseKey";

@Service()
export class LicenseKeyDao extends Dao<LicenseKey> {
    protected getRepository(): Repository<LicenseKey> {
        return this.getEm().getRepository(LicenseKey);
    }
}

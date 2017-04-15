import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { MailTemplate, MailTemplateType } from "../entity/MailTemplate";

@Service()
export class MailTemplateDao extends Dao<MailTemplate> {
    protected getRepository(): Repository<MailTemplate> {
        return this.getEm().getRepository(MailTemplate);
    }

    public async getByType(type: MailTemplateType): Promise<MailTemplate> {
        return this.getRepository().findOne({type: type});
    }
}

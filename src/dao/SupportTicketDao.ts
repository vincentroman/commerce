import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { SupportTicket } from "../entity/SupportTicket";

@Service()
export class SupportTicketDao extends Dao<SupportTicket> {
    protected getRepository(): Repository<SupportTicket> {
        return this.getEm().getRepository(SupportTicket);
    }
}

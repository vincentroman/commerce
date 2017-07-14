import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Comment } from "../entity/Comment";

@Service()
export class CommentDao extends Dao<Comment> {
    protected getRepository(): Repository<Comment> {
        return this.getEm().getRepository(Comment);
    }

    public async getByUuid(uuid: string): Promise<Comment> {
        return this.getRepository()
            .createQueryBuilder("c")
            .innerJoinAndSelect("c.author", "author")
            .where("c.uuid = :uuid")
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async getAllSupportTicketComments(supportTicketUuid: string): Promise<Comment[]> {
        return this.getRepository()
            .createQueryBuilder("c")
            .innerJoinAndSelect("c.author", "author")
            .innerJoinAndSelect("c.supportTicket", "supportTicket")
            .orderBy("c.createDate", "ASC")
            .where("c.supportTicket.uuid = :supportTicketUuid")
            .setParameters({supportTicketUuid: supportTicketUuid})
            .getMany();
    }

    public async getAllCustomerComments(customerUuid: string): Promise<Comment[]> {
        return this.getRepository()
            .createQueryBuilder("c")
            .innerJoinAndSelect("c.author", "author")
            .innerJoinAndSelect("c.customer", "customer")
            .orderBy("c.createDate", "ASC")
            .where("c.customer.uuid = :customerUuid")
            .setParameters({customerUuid: customerUuid})
            .getMany();
    }
}

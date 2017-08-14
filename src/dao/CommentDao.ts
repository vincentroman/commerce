import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Comment } from "../entity/Comment";

@Service()
export class CommentDao extends Dao<Comment> {
    protected getRepository(): Repository<Comment> {
        return this.getEm().getRepository(Comment);
    }

    protected allowPhysicalDelete(o: Comment): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(true));
    }

    public async getByUuid(uuid: string): Promise<Comment> {
        return this.getRepository()
            .createQueryBuilder("c")
            .innerJoinAndSelect("c.author", "author")
            .where("c.uuid = :uuid")
            .andWhere("c.deleted != 1")
            .setParameters({uuid: uuid})
            .getOne();
    }

    public async getAllSupportTicketComments(supportTicketUuid: string): Promise<Comment[]> {
        return this.getRepository()
            .createQueryBuilder("c")
            .innerJoinAndSelect("c.author", "author")
            .innerJoinAndSelect("c.supportTicket", "supportTicket")
            .orderBy("c.createDate", "DESC")
            .where("supportTicket.uuid = :supportTicketUuid")
            .andWhere("c.deleted != 1")
            .setParameters({supportTicketUuid: supportTicketUuid})
            .getMany();
    }

    public async getAllCustomerComments(customerUuid: string): Promise<Comment[]> {
        return this.getRepository()
            .createQueryBuilder("c")
            .innerJoinAndSelect("c.author", "author")
            .innerJoinAndSelect("c.customer", "customer")
            .orderBy("c.createDate", "DESC")
            .where("customer.uuid = :customerUuid")
            .andWhere("c.deleted != 1")
            .setParameters({customerUuid: customerUuid})
            .getMany();
    }
}

import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { Comment } from "../entity/Comment";

@Service()
export class CommentDao extends Dao<Comment> {
    protected getRepository(): Repository<Comment> {
        return this.getEm().getRepository(Comment);
    }
}

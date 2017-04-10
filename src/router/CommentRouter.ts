import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { Comment } from '../entity/Comment';
import { CommentDao } from '../dao/CommentDao';

class CommentRouter extends CrudRouter<Comment, CommentDao> {
    protected getDao(): CommentDao {
        return Container.get(CommentDao);
    }
    protected createEntity(requestBody: any): Comment {
        return new Comment(requestBody);
    }
}

export default new CommentRouter().router;

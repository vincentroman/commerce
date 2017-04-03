import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { CrudRouter } from "./CrudRouter";

import { CustomerNote } from '../entity/CustomerNote';
import { CustomerNoteDao } from '../dao/CustomerNoteDao';

class CustomerNoteRouter extends CrudRouter<CustomerNote, CustomerNoteDao> {
    protected getDao(): CustomerNoteDao {
        return Container.get(CustomerNoteDao);
    }
    protected createEntity(requestBody: any): CustomerNote {
        return new CustomerNote(requestBody);
    }
}

export default new CustomerNoteRouter().router;

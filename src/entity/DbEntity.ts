import { AbstractEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import * as moment from 'moment';

@AbstractEntity()
export abstract class DbEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    uuid: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    lastUpdate: Date;

    constructor(o?: Object) {
        if (o) {
            this.deserialize(o);
        }
    }

    public serialize(): Object {
        return {
            uuid:       this.uuid,
            createDate: moment(this.createDate).format("YYYY-MM-DD HH:mm:ss"),
            lastUpdate: moment(this.lastUpdate).format("YYYY-MM-DD HH:mm:ss")
        };
    }

    public abstract deserialize(o: Object): void;
}

import { AbstractEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import * as moment from 'moment';

@AbstractEntity()
export abstract class DbEntity<T extends DbEntity<T>> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    uuid: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    lastUpdate: Date;

    @Column({default: false})
    deleted: boolean;

    constructor(o?: Object) {
        if (o) {
            this.deserialize(o);
        }
    }

    public serialize(): Object {
        if (this.deleted) {
            throw new Error("Must not serialize a deleted entity");
        }
        return {
            uuid:       this.uuid,
            createDate: moment(this.createDate).format("YYYY-MM-DD HH:mm:ss"),
            lastUpdate: moment(this.lastUpdate).format("YYYY-MM-DD HH:mm:ss")
        };
    }

    public abstract deserialize(o: Object): T;

    public abstract isConsistent(): boolean;
}

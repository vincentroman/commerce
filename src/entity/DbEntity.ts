import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import * as moment from 'moment';

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

    @VersionColumn()
    version: number;

    constructor(o?: Object) {
        if (o) {
            this.deserialize(o);
        }
    }

    public serialize(skipDeletedCheck?: boolean): Object {
        if (!skipDeletedCheck && this.deleted) {
            throw new Error("Must not serialize a deleted entity");
        }
        return {
            uuid:       this.uuid,
            createDate: moment(this.createDate).format("YYYY-MM-DD HH:mm:ss"),
            lastUpdate: moment(this.lastUpdate).format("YYYY-MM-DD HH:mm:ss"),
            version:    this.version
        };
    }

    public abstract deserialize(o: Object): T;

    public abstract isConsistent(): boolean;
}

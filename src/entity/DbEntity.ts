import { AbstractEntity, Column, PrimaryGeneratedColumn } from "typeorm";

@AbstractEntity()
export abstract class DbEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    uuid: string;

    constructor(o?: Object) {
        if (o) {
            this.deserialize(o);
        }
    }

    public abstract serialize(): Object;
    protected abstract deserialize(o: Object): void;
}

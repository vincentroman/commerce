import { AbstractEntity, Column, PrimaryGeneratedColumn } from "typeorm";

@AbstractEntity()
export abstract class DbEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    uuid: string;
}

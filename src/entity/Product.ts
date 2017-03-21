import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;
}

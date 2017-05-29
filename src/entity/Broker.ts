import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class Broker extends DbEntity {
    @Column()
    name: string;

    @Column("text", {nullable: true})
    mappingTemplate: string;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            name: this.name,
            mappingTemplate: this.mappingTemplate
        });
    }

    public deserialize(o: Object): void {
        this.name = o['name'];
        this.mappingTemplate = o['mappingTemplate'];
    }
}

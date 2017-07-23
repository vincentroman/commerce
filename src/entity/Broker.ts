import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class Broker extends DbEntity<Broker> {
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

    public deserialize(o: Object): Broker {
        this.name = o['name'];
        this.mappingTemplate = o['mappingTemplate'];
        return this;
    }

    public isConsistent(): boolean {
        if (this.name) {
            return true;
        }
        return false;
    }
}

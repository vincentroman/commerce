import { Entity, Column } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class Customer extends DbEntity {
    public serialize(): Object {
        return {
            uuid: this.uuid
        };
    }

    protected deserialize(o: Object): void {
        this.uuid = o['uuid'];
    }
}

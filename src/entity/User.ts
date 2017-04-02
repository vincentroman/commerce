import { Entity, Column } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class User extends DbEntity {
    public serialize(): Object {
        return Object.assign(super.serialize(), {
        });
    }

    public  deserialize(o: Object): void {
        // TODO
    }
}

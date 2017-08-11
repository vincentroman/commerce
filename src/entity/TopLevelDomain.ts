import { Entity, Column } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class TopLevelDomain extends DbEntity<TopLevelDomain> {
    @Column({unique: true})
    tld: string;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
            tld: this.tld
        });
    }

    public  deserialize(o: Object): TopLevelDomain {
        this.tld = o['tld'];
        return this;
    }

    public isConsistent(): boolean {
        if (this.tld) {
            return true;
        }
        return false;
    }
}

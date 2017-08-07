import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class PendingAction extends DbEntity<PendingAction> {
    @Column()
    type: ActionType;

    @Column()
    payload: string;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
        });
    }

    public deserialize(o: Object): PendingAction {
        return this;
    }

    public setPayload(payload: any): void {
        this.payload = JSON.stringify(payload);
    }

    public getPayload(): any {
        return JSON.parse(this.payload);
    }

    public isConsistent(): boolean {
        if (this.type &&
            this.payload) {
            return true;
        }
        return false;
    }
}

export enum ActionType {
    ResetPassword = 1,
    ChangeEmail = 2
}

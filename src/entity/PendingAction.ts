import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class PendingAction extends DbEntity<PendingAction> {
    @Column()
    type: ActionType;

    @Column("text")
    payload: string;

    @Column({nullable: true})
    expiry: Date;

    public serialize(skipDeletedCheck?: boolean): Object {
        return Object.assign(super.serialize(skipDeletedCheck), {
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
    ChangeEmail = 2,
    ConfirmOrder = 3
}

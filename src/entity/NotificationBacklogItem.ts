import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";
import { Person } from "./Person";

@Entity()
export class NotificationBacklogItem extends DbEntity<NotificationBacklogItem> {
    @Column()
    type: NotificationType;

    @Column("datetime")
    dueDate: Date;

    @Column({nullable: true})
    payload: string;

    @ManyToOne(type => Person)
    person: Person;

    public serialize(): Object {
        return Object.assign(super.serialize(), {
        });
    }

    public deserialize(o: Object): NotificationBacklogItem {
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

export enum NotificationType {
    REMIND_EVAL_BUY = 1,
    REMIND_EXPIRY = 2
}

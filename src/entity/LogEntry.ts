import { Entity, Column } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class LogEntry extends DbEntity<LogEntry> {
    @Column()
    type: LogEntryType = LogEntryType.Undefined;

    @Column()
    level: LogEntryLevel = LogEntryLevel.Info;

    @Column("text")
    message: string;

    public serialize(skipDeletedCheck?: boolean): Object {
        return Object.assign(super.serialize(skipDeletedCheck), {
            type: this.type,
            message: this.message
        });
    }

    public deserialize(o: Object): LogEntry {
        // Deserializing not supported
        return this;
    }

    public isConsistent(): boolean {
        if (this.type || this.level) {
            return true;
        }
        return false;
    }
}

export enum LogEntryType {
    Undefined = 1,
    OptIn = 2,
    OptOut = 3,
    Auth = 4
}

export enum LogEntryLevel {
    Info = 1,
    Warning = 2,
    Error = 3
}

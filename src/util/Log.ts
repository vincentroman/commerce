import { LogEntryLevel, LogEntryType, LogEntry } from "../entity/LogEntry";
import { Container } from "typedi";
import { LogEntryDao } from "../dao/LogEntryDao";

export class Log {
    public static async log(level: LogEntryLevel, message: string, type?: LogEntryType): Promise<LogEntry> {
        let entry: LogEntry = new LogEntry();
        if (type) {
            entry.type = type;
        }
        entry.level = level;
        entry.message = message;
        return Container.get(LogEntryDao).save(entry);
    }

    public static async info(message: string, type?: LogEntryType): Promise<LogEntry> {
        return Log.log(LogEntryLevel.Info, message, type);
    }

    public static async warn(message: string, type?: LogEntryType): Promise<LogEntry> {
        return Log.log(LogEntryLevel.Warning, message, type);
    }

    public static async error(message: string, type?: LogEntryType): Promise<LogEntry> {
        return Log.log(LogEntryLevel.Error, message, type);
    }
}

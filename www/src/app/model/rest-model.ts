import * as moment from "moment";

export abstract class RestModel<T> {
    uuid: string;
    createDate: moment.Moment;
    lastUpdate: moment.Moment;

    serialize(): Object {
        return {
            "uuid": this.uuid
        };
    }

    abstract deserialize(input: any): T;

    protected _deserialize(input: any): void {
        this.uuid = input.uuid;
        this.createDate = (input.createDate ? moment(input.createDate, "YYYY-MM-DD HH:mm:ss") : null);
        this.lastUpdate = (input.lastUpdate ? moment(input.lastUpdate, "YYYY-MM-DD HH:mm:ss") : null);
    }
}

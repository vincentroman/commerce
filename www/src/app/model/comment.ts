import { RestModel } from "./rest-model";
import * as moment from "moment";
import { Person } from "./person";

export class Comment extends RestModel<Comment> {
    text: string;
    customerUuid: string = "";
    supportTicketUuid: string = "";
    author: Person = new Person();

    serialize(): Object {
        return Object.assign(super.serialize(), {
            // Not supported
        });
    }

    deserialize(input: any): Comment {
        this._deserialize(input);
        this.text = input.text;
        this.customerUuid = input.customerUuid;
        this.supportTicketUuid = input.supportTicketUuid;
        this.author = (input.author ? new Person().deserialize(input.author) : null);
        return this;
    }
}

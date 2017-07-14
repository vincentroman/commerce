import { RestModel } from "./rest-model";
import * as moment from "moment";
import { User } from "./user";

export class Comment extends RestModel<Comment> {
    text: string;
    customerUuid: string = "";
    supportTicketUuid: string = "";
    author: User = new User();

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
        this.author = (input.author ? new User().deserialize(input.author) : null);
        return this;
    }
}

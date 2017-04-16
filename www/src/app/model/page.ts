import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";

export class Page extends RestModel implements Serializable<Page> {
    title: string;
    content: string;
    shortLink: string;

    serialize(): Object {
        return {
            "id": this.id,
            "title": this.title,
            "content": this.content,
            "shortLink": this.shortLink
        };
    }

    deserialize(input: any): Page {
        this.id = input.id;
        this.title = input.title;
        this.content = input.content;
        this.shortLink = input.shortLink;
        return this;
    }
}

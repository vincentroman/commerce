import { RestModel } from "./rest-model";

export class Broker extends RestModel<Broker> {
    name: string;
    mappingTemplate: string;

    serialize(): Object {
        return Object.assign(super.serialize(), {
            "name": this.name,
            "mappingTemplate": this.mappingTemplate
        });
    }

    deserialize(input: any): Broker {
        this._deserialize(input);
        this.name = input.name;
        this.mappingTemplate = input.mappingTemplate;
        return this;
    }
}

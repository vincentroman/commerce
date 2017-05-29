import { RestModel } from "./rest-model";
import { Serializable } from "./serializable";

export class Broker extends RestModel implements Serializable<Broker> {
    name: string;
    mappingTemplate: string;

    serialize(): Object {
        return {
            "uuid": this.uuid,
            "name": this.name,
            "mappingTemplate": this.mappingTemplate
        };
    }

    deserialize(input: any): Broker {
        this.uuid = input.uuid;
        this.name = input.name;
        this.mappingTemplate = input.mappingTemplate;
        return this;
    }
}

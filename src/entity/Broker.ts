import { Entity, Column, ManyToOne } from "typeorm";
import { DbEntity } from "./DbEntity";

@Entity()
export class Broker extends DbEntity<Broker> {
    @Column()
    name: string;

    @Column("text", {nullable: true})
    mappingTemplate: string;

    @Column({nullable: true})
    securityType: BrokerSecurityType;

    @Column({nullable: true})
    securityKey: string;

    @Column({nullable: true})
    securityMatchValue: string;

    public serialize(skipDeletedCheck?: boolean): Object {
        return Object.assign(super.serialize(skipDeletedCheck), {
            name: this.name,
            mappingTemplate: this.mappingTemplate,
            securityType: (this.securityType ? this.securityType : BrokerSecurityType.None),
            securityKey: this.securityKey,
            securityMatchValue: this.securityMatchValue
        });
    }

    public deserialize(o: Object): Broker {
        this.name = o['name'];
        this.mappingTemplate = o['mappingTemplate'];
        this.securityType = o['securityType'];
        this.securityKey = o['securityKey'];
        this.securityMatchValue = o['securityMatchValue'];
        return this;
    }

    public isConsistent(): boolean {
        if (this.name) {
            return true;
        }
        return false;
    }
}

export enum BrokerSecurityType {
    None = 0,
    HttpRequestHeader = 1,
    JsonPath = 2,
    FastSpring = 3
}

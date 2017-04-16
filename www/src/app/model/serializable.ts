export interface Serializable<T> {
    serialize(): Object;
    deserialize(input: any): T;
}

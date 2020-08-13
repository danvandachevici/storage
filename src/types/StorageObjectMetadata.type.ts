import {UserType} from "./User.type";

export class StorageObjectMetadataType {
    name: string;
    created: Date;
    modified: Date;
    owner: UserType;
    constructor(name: string, owner: UserType, created?: Date, modified?: Date) {
        this.name = name;
        this.owner = owner;
        this.created = created || new Date();
        this.modified = modified || new Date();
    }
}

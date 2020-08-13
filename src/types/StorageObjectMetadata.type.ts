import {UserType} from "./User.type";
import {ObjectEnumType} from "./ObjectEnum.type";

export class StorageObjectMetadataType {
    name: string;
    created: Date;
    modified: Date;
    owner: UserType;
    type: ObjectEnumType;
    constructor(name: string, type: ObjectEnumType, created?: Date, modified?: Date, owner?: UserType) {
        this.name = name;
        this.type = type;
        this.owner = owner || undefined;
        this.created = created || new Date();
        this.modified = modified || new Date();
    }
}

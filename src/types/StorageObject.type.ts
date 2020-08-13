import {StorageObjectMetadataType} from "./StorageObjectMetadata.type";

export class StorageObjectType {

    public data: string;
    public metaData: StorageObjectMetadataType;

    constructor(data: Buffer|string|object, meta: StorageObjectMetadataType) {
        if (typeof data === 'object') {
            if (data instanceof Buffer) {
                this.data = data.toString();
            } else {
                this.data = JSON.stringify(data);
            }
        } else {
            this.data = data;
        }

        this.metaData = meta;
    }
}

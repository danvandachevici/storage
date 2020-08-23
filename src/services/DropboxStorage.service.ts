import {StorageEngineInterface} from "../interfaces/StorageEngine.interface";
import {PathType} from "../types/Path.type";
import {StorageObjectType} from "../types/StorageObject.type";
import {StorageObjectMetadataType} from "../types/StorageObjectMetadata.type";
import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";

export class DropboxStorageService implements StorageEngineInterface {

    constructor(config: StorageEngineConfigType) {
    }

    deleteObject(path: PathType): Promise<any> {
        return Promise.resolve(undefined);
    }

    deleteRecursive(path: PathType): Promise<any> {
        return Promise.resolve(undefined);
    }

    ensurePath(path): Promise<any> {
        return Promise.resolve(undefined);
    }

    getAvailableSpace(): Promise<number> {
        return Promise.resolve(0);
    }

    getObject(path: PathType): Promise<StorageObjectType> {
        return Promise.resolve(undefined);
    }

    listObjects(path: PathType): Promise<StorageObjectMetadataType[]> {
        return Promise.resolve([]);
    }

    putObject(data: string, name: string, path: PathType): Promise<any> {
        return Promise.resolve(undefined);
    }

}

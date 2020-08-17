import {StorageObjectType} from "../types/StorageObject.type";
import {PathType} from "../types/Path.type";
import {StorageObjectMetadataType} from "../types/StorageObjectMetadata.type";

export interface StorageEngineInterface {
    putObject(data: string, name: string, path: PathType): Promise<any>;
    getObject(path: PathType): Promise<StorageObjectType>;
    listObjects(path: PathType): Promise<StorageObjectMetadataType[]>;
    deleteObject(path: PathType): Promise<any>;
    deleteRecursive(path: PathType): Promise<any>;
    getAvailableSpace(): Promise<number>;
    ensurePath(path): Promise<any>;
}

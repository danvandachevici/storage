import {StorageObjectType} from "../types/StorageObject.type";
import {PathType} from "../types/Path.type";
import {StorageObjectMetadataType} from "../types/StorageObjectMetadata.type";
import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";

export interface StorageEngineInterface {
    putObject(obj: StorageObjectType): Promise<any>;
    getObject(path: PathType): Promise<StorageObjectType>;
    listObjects(path: PathType): Promise<StorageObjectMetadataType[]>;
    deleteObject(path: PathType): Promise<any>;
    deleteRecursive(path: PathType): Promise<any>;
}

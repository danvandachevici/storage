import {StorageEngineInterface} from "../interfaces/StorageEngine.interface";
import {PathType} from "../types/Path.type";
import {StorageObjectType} from "../types/StorageObject.type";
import {StorageObjectMetadataType} from "../types/StorageObjectMetadata.type";
import {UserType} from "../types/User.type";
import * as fsSync from 'fs';
import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";

const fs = fsSync.promises;

export class LocalStorageService implements StorageEngineInterface {

    fsClient: any
    baseDir: string;
    limitKb: number;

    constructor(config: StorageEngineConfigType) {
        this.fsClient = fs;
        this.baseDir = config.baseDir;
        this.limitKb = config.getLimitInKb();
    }

    deleteObject(path: PathType): Promise<any> {
        return fs.rmdir(path, {recursive: true});
    }

    getObject(path: PathType): Promise<StorageObjectType> {
        return fs.readFile(path).then((data:Buffer) => {
            return new StorageObjectType(data, new StorageObjectMetadataType('', new UserType('')));
        });
    }

    listObjects(path: PathType): Promise<StorageObjectMetadataType[]> {
        return Promise.resolve([]);
    }

    putObject(obj: StorageObjectType): Promise<any> {
        return Promise.resolve(undefined);
    }

    deleteRecursive(path: PathType): Promise<any> {
        return Promise.resolve(undefined);
    }

}

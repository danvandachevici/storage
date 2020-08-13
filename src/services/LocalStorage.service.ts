import {StorageEngineInterface} from "../interfaces/StorageEngine.interface";
import {PathType} from "../types/Path.type";
import {StorageObjectType} from "../types/StorageObject.type";
import {StorageObjectMetadataType} from "../types/StorageObjectMetadata.type";
import * as fsSync from 'fs';
import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";
import {ObjectEnumType} from "../types/ObjectEnum.type";

const fs = fsSync.promises;

export class LocalStorageService implements StorageEngineInterface {

    baseDir: string;
    limitKb: number;

    constructor(config: StorageEngineConfigType) {
        this.baseDir = config.baseDir;
        this.limitKb = config.getLimitInKb();
    }

    deleteObject(path: PathType): Promise<any> {
        return fs.rmdir(path, {recursive: true});
    }

    getObject(path: PathType): Promise<StorageObjectType> {
        return Promise.all([
            fs.readFile(this.baseDir + '/' + path),
            fs.stat(this.baseDir + '/' + path)
        ]).then(([fileContent, stat]) => {
            return new StorageObjectType(
                fileContent,
                new StorageObjectMetadataType(path, ObjectEnumType.File, stat.ctime, stat.mtime)
            );
        });
    }

    listObjects(path: PathType): Promise<StorageObjectMetadataType[]> {
        return fs.readdir(this.baseDir + '/' + path, {withFileTypes: true}).then((objects) => {
            const promises = objects.map((obj) => {
                return fs.stat(this.baseDir + '/' + path + '/' + obj.name).then((stat) => {
                    if (stat.isDirectory()) {
                        return new StorageObjectMetadataType(obj.name, ObjectEnumType.Folder, stat.ctime, stat.mtime);
                    } else {
                        return new StorageObjectMetadataType(obj.name, ObjectEnumType.File, stat.ctime, stat.mtime);
                    }
                })
            });
            return Promise.all(promises);
        })
    }

    deleteRecursive(path: PathType): Promise<any> {
        return Promise.resolve(undefined);
    }

    putObject(data: string, name: string, path: PathType): Promise<any> {
        const newObj = new StorageObjectType(
            data,
            new StorageObjectMetadataType(name, ObjectEnumType.File)
        )
        return fs.writeFile(this.baseDir + '/' + path + '/' + name, data);
    }

}

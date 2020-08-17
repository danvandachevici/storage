import {StorageEngineInterface} from "../interfaces/StorageEngine.interface";
import {PathType} from "../types/Path.type";
import {StorageObjectType} from "../types/StorageObject.type";
import {StorageObjectMetadataType} from "../types/StorageObjectMetadata.type";
import * as fsSync from 'fs';
import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";
import {ObjectEnumType} from "../types/ObjectEnum.type";
import {Stats} from "fs";

const fs = fsSync.promises;

export class LocalStorageService implements StorageEngineInterface {

    baseDir: string;
    limitKb: number;

    constructor(config: StorageEngineConfigType) {
        this.baseDir = config.baseDir || '/tmp';
        this.limitKb = config.getLimitInKb();

        if (this.baseDir.endsWith('/')) {
            this.baseDir = this.baseDir.replace(/\/$/, '');
        }
    }

    deleteObject(path: PathType): Promise<any> {
        return fs.unlink(this.baseDir + '/' + path);
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
        return fs.rmdir(this.baseDir + '/' + path, {recursive: true});
    }

    ensurePath(path): Promise<any> {
        return fs.stat(path).then((stat: Stats) => {
            if(stat) {
                return '';
            } else {
                return fs.mkdir(path, {recursive: true}).catch((e) => {
                    console.log('Exception on mkdir:', e);
                });
            }
        }).catch((ex) => {
            console.log(`exception calling stat ${path}`);
            return fs.mkdir(path, {recursive: true});
        });
    }

    putObject(data: string, name: string, path: PathType): Promise<any> {
        // check size of data:
        // ensure folder exists
        let computedPathDir = (this.baseDir + '/' + path).replace(/\/\/+/g, '/');;
        let computedPathFile = (computedPathDir + '/' + name).replace(/\/\/+/g, '/');;

        return this.ensurePath(computedPathDir).then(() => {
            return fs.writeFile(computedPathFile, data).then(() => {return;});
        }).catch((e) => {
            console.log('Exception:', e);
        });
    }

    getAvailableSpace(): Promise<number> {
        if (this.limitKb) {
            return Promise.resolve(this.limitKb);
        }
        return Promise.resolve(0);
    }
}

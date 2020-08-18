import {StorageEngineInterface} from "../interfaces/StorageEngine.interface";
import {PathType} from "../types/Path.type";
import {StorageObjectType} from "../types/StorageObject.type";
import {StorageObjectMetadataType} from "../types/StorageObjectMetadata.type";
import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";
import * as AWS from 'aws-sdk';
import {ObjectEnumType} from "../types/ObjectEnum.type";

export class S3StorageService implements StorageEngineInterface {

    bucket: string;
    limitKb: number;
    defaultBucketName = 'default';
    s3Client: AWS.S3;

    constructor(config: StorageEngineConfigType) {
        this.bucket = config.baseDir;
        this.s3Client = new AWS.S3({apiVersion: '2006-03-01'});
    }

    deleteObject(path: PathType): Promise<any> {
        const {bucketName, computedPath} = this.getBucketAndPathFromPath(path);
        const deleteParams = {
            Bucket: bucketName,
            Key: computedPath
        }
        return this.s3Client.deleteObject(deleteParams).promise();
    }

    deleteRecursive(path: PathType): Promise<any> {
        return Promise.resolve(undefined);
    }

    getBucketAndPathFromPath(path: PathType) {
        let bucketName = this.bucket;
        let computedPath = path;
        computedPath = computedPath.replace(/^\//, '');
        computedPath = computedPath.replace(/\/$/, '');
        if (!this.bucket || this.bucket === '') {
            const tokens = path.split('/');
            if (tokens.length > 1) {
                bucketName = tokens[0];
                computedPath = tokens.slice(0, 1).join('/');
            } else {
                bucketName = this.defaultBucketName;
            }
        }
        return {bucketName, computedPath};
    }
    ensurePath(path: string): Promise<any> {
        const bucketName = path.split('/')[0];
        return this.s3Client.createBucket({Bucket: bucketName}).promise().then((res) => {
            return true;
        }).catch((exc) => {
            console.log('Exception:', exc);
        });
    }

    getAvailableSpace(): Promise<number> {
        return Promise.resolve(0);
    }

    getObject(path: PathType): Promise<StorageObjectType> {
        const {bucketName, computedPath} = this.getBucketAndPathFromPath(path);
        const getParams = {
            Bucket: bucketName,
            Key: computedPath,
        }
        console.log('S3 - getting', getParams);
        const fileName = this.getFileName(computedPath);
        return this.s3Client.getObject(getParams).promise().then((ret) => {
            return new StorageObjectType(
                ret.Body.toString(),
                new StorageObjectMetadataType(fileName, ObjectEnumType.File, new Date(parseInt(ret.Metadata['x-amz-meta-created'])), ret.LastModified)
            )
        });
    }

    listObjects(path: PathType): Promise<StorageObjectMetadataType[]> {
        const {bucketName, computedPath} = this.getBucketAndPathFromPath(path);
        const listParams = {
            Bucket: bucketName,
            Prefix: computedPath,
            MaxKeys: 1000 // todo: fix this hardcode
        }
        return this.s3Client.listObjectsV2(listParams).promise().then((data) => {
            return data.Contents.map((obj) => {
                return new StorageObjectMetadataType(
                    obj.Key,
                    ObjectEnumType.File,
                    null,
                    obj.LastModified
                );
            })
        });
    }

    putObject(data: string, name: string, path: PathType): Promise<any> {
        const {bucketName, computedPath} = this.getBucketAndPathFromPath(path);
        let key;
        if (!computedPath) {
            key = `${name}`;
        } else {
            key = `${computedPath}/${name}`.replace(/\/\//g, '/');
        }
        const putParams = {
            Bucket: bucketName,
            Key: key,
            Body: data,
            Metadata: {
                'x-amz-meta-created': '' + new Date().getTime(),
            }
        };
        const ensurePath = `${bucketName}/${computedPath}`.replace(/\/\//g, '/').replace(/\/$/, '');
        console.log('S3 - ensuring path:', ensurePath)
        return this.ensurePath(ensurePath).then(() => {
            console.log('S3 - putObject params', putParams)
            return this.s3Client.putObject(putParams).promise().then((res) => {
                return res;
            });
        });
    }

    private getFileName(computedPath: string) {
        const tokens = computedPath.split('/');
        return tokens[tokens.length-1];
    }
}

import {StorageEngineInterface} from "../interfaces/StorageEngine.interface";
import {PathType} from "../types/Path.type";
import {StorageObjectType} from "../types/StorageObject.type";
import {StorageObjectMetadataType} from "../types/StorageObjectMetadata.type";
import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";
import * as AWS from 'aws-sdk';
import {ObjectEnumType} from "../types/ObjectEnum.type";

export class S3Service implements StorageEngineInterface {

    bucket: string;
    limitKb: number;
    defaultBucketName = 'default';
    s3Client: AWS.S3;

    constructor(config: StorageEngineConfigType) {
        AWS.config.credentials.accessKeyId = config.credentials.accessKeyId;
        AWS.config.credentials.secretAccessKey = config.credentials.secretAccessKey;
        this.bucket = config.baseDir;
        this.s3Client = new AWS.S3({apiVersion: '2006-03-01'});
    }

    deleteObject(path: PathType): Promise<any> {
        return Promise.resolve(undefined);
    }

    deleteRecursive(path: PathType): Promise<any> {
        return Promise.resolve(undefined);
    }

    getBucketAndPathFromPath(path: PathType) {
        let bucketName = this.bucket;
        let computedPath = path;
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
    ensurePath(path): Promise<any> {
        const bucketName = this.getBucketAndPathFromPath(path).bucketName;
        return this.s3Client.createBucket({Bucket: bucketName}).promise();
    }

    getAvailableSpace(): Promise<number> {
        return Promise.resolve(0);
    }

    getObject(path: PathType): Promise<StorageObjectType> {
        return Promise.resolve(undefined);
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
        const params = {
            Bucket: bucketName,
            Key: `${computedPath}/${name}`,
            Body: data
        };
        return this.s3Client.putObject(params).promise();
    }

}

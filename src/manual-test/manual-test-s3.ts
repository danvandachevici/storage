import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";
import {StorageEnumType} from "../types/StorageEnum.type";
import {StorageEngineInterface} from "../interfaces/StorageEngine.interface";
import {S3Service} from "../services/S3.service";

const config = new StorageEngineConfigType();
config.limitUsage = '100mb';
config.baseDir = 'testBucket';
config.type = StorageEnumType.s3;
config.credentials.accessKeyId = 'AKIAYKEQEWFVP3N7YAWS';
config.credentials.secretAccessKey = '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';
const storage: StorageEngineInterface = new S3Service(config);

storage.putObject('This is some data', 'file1', '/').then(() => {
    console.log('Object saved');
    storage.getObject('file1').then((obj) => {
        console.log('Object fetched:', obj.metaData.name, obj.data.toString());
        storage.deleteObject('file1').then(() => {
            console.log('Object deleted');
            storage.getAvailableSpace().then((space) => {
                console.log('Space:', space);
            })
        });
    });
});


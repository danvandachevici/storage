import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";
import {StorageEnumType} from "../types/StorageEnum.type";
import {StorageEngineInterface} from "../interfaces/StorageEngine.interface";
import {S3StorageService} from "../services/S3Storage.service";

const config = new StorageEngineConfigType();
config.limitUsage = '100mb';
config.baseDir = 'testbucket.vandachevici.ro';
config.type = StorageEnumType.s3;
const storage: StorageEngineInterface = new S3StorageService(config);

storage.putObject('This is some data', 'file1', '/').then(() => {
    console.log('Object saved');
    storage.getObject('/file1').then((obj) => {
        console.log('Object fetched:', obj.metaData.name, obj.data.toString());
        storage.deleteObject('file1').then(() => {
            console.log('Object deleted');
            storage.getAvailableSpace().then((space) => {
                console.log('Space:', space);
            });
        });
    });
});


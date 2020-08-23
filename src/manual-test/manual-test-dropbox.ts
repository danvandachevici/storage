import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";
import {StorageProvidersEnumType} from "../types/StorageProvidersEnum.type";
import {StorageEngineInterface} from "../interfaces/StorageEngine.interface";
import {DropboxStorageService} from "../services/DropboxStorage.service";

const config = new StorageEngineConfigType();
config.limitUsage = '100mb';
config.baseDir = 'testbucket.vandachevici.ro';
config.type = StorageProvidersEnumType.s3;
const storage: StorageEngineInterface = new DropboxStorageService(config);

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


import {StorageEngineInterface} from "../interfaces/StorageEngine.interface";
import {LocalStorageService} from "../services/LocalStorage.service";
import {StorageEngineConfigType} from "../types/StorageEngineConfig.type";
import {StorageProvidersEnumType} from "../types/StorageProvidersEnum.type";

const config = new StorageEngineConfigType();
config.limitUsage = '100mb';
config.baseDir = '/tmp/test1';
config.type = StorageProvidersEnumType.localStorage;
const storage: StorageEngineInterface = new LocalStorageService(config);

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

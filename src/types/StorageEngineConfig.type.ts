import {StorageEnumType} from "./StorageEnum.type";

export class StorageEngineConfigType {
    /**
     * baseDir is used differently in each context
     * * in localStorage system, it needs to be an absolute path on the fs. If empty string, it defaults to /tmp/
     * * in s3, if this is a name, it will create a bucket. If empty string, it will create a bucket everytime a saved file
     * has a 'folder' structure. Example: saving  a file to "projects/myfile.html" will create a bucket called "projects"
     */
    baseDir: string = '';

    /**
     * limitUsage sets limits for the storage engine, in KB.
     * On localStorage, if empty string, it will use the maximum amount of storage available
     * In s3, it will cap to 10gb.
     * In Dropbox, if empty string, it will use as much as available.
     * Possible values: <number><kb,mb,gb> ex: 100kb, 50mb, 10gb
     */
    limitUsage: string = '';

    type: StorageEnumType;

    credentials: {
        accessKeyId: string,
        secretAccessKey: string
    };

    getLimitInKb() {
        let factor = 1;
        if (this.limitUsage.indexOf('mb') !== -1) {
            factor = 1024;
        }
        if (this.limitUsage.indexOf('gb') !== -1) {
            factor = 1024*1024;
        }
        const limitNumber:number = +(this.limitUsage.match(/^[0-9]+/)[0]);
        return limitNumber * factor;
    }
}

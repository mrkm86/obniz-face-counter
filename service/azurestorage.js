"use strict";

//npm module ------------------------------------------------------------------------
const debug = require("debug")("*");
const azure = require('azure-storage');
const Promise = require("bluebird");
const fs = Promise.promisifyAll( require( "fs" ) );
const blobService = Promise.promisifyAll( azure.createBlobService(process.env.CONNECTION_STRING) );

//service ---------------------------------------------------------------------------

//variable --------------------------------------------------------------------------
const container = process.env.CONTAINER

module.exports = class ServiceAzureStorage {

    static uploadBLOB(fileTemp, blobdata)
    {
        let blobname = fileTemp;

        debug(`writeFileAsync is started.`);
        return fs.writeFileAsync(fileTemp, blobdata, 'base64')
        .then(
            (response) => {
                debug(`writeFileAsync is completed.`);
                return fileTemp;
            }
        ).then(
            (response) => {
                blobService.createContainerIfNotExistsAsync(container);
                return response;
            },
            (error) => {
                debug(`error is occured at createContainerIfNotExistsAync()`);
                return Promise.reject(new Error("err_createContainerIfNotExistsAync"));
            }
        ).then(
            (response) => {
                debug(`createContainer is completed.`);
                return blobService.createBlockBlobFromLocalFileAsync(container, blobname, fileTemp);
            },
            (error) => {
                debug(`error is occured at createBlockBlobFromLocalFileAsync()`);
                return Promise.reject(new Error("err_createBlockBlobFromLocalFileAsync"));
            }
        ).then(
            (response) => {
                debug(`createBlockBlobFromLocalFile is completed.`);

                debug(`Delete temp file`);
                fs.unlinkSync(fileTemp);

                debug("exit ServiceAzureStorage uploadBLOB method.");
                return response;
            },
            (error) => {
                debug(`error is occured at ServiceAzureStorage.uploadBLOB()`);
                return Promise.reject(new Error("err_uploadBLOB"));
            }
        );
    }
}
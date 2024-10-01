import * as fs from 'fs';
import * as csv from 'fast-csv';
export const csvToJson =function(csvFilePath,onData,onEnd){
    fs.createReadStream(csvFilePath)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data',onData)
    .on('end',onEnd);
};

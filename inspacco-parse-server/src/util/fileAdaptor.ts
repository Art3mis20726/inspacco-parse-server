/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { S3Adapter } from 'parse-server';
import { getBufferCompressor } from './compression';
export class InspaccoFileAdaptor {
    constructor(private readonly s3FAdaptor: S3Adapter) {}

    public async createFile(filename: string, data: any, contentType: string, options: any): Promise<any> {
        const outputBuffer = await this.reduceBufferIfRequired(filename, data);
        return this.s3FAdaptor.createFile(filename, outputBuffer, contentType, options);
    }

    public async deleteFile(filename: string): Promise<any> {
        return this.s3FAdaptor.deleteFile(filename);
    }

    public async getFileData(filename: string): Promise<any> {
        const data = await this.s3FAdaptor.getFileData(filename);
        return data;
    }

    public getFileLocation(config: any, filename: string): string {
        const str = this.s3FAdaptor.getFileLocation(config, filename);
        return str;
    }

    private async reduceBufferIfRequired(fileName: string, buffer: Buffer): Promise<Buffer> {
            const bufferCompressor = await getBufferCompressor(fileName, buffer);
            let outputBuffer = buffer;
            if(bufferCompressor) {
                try {
                    outputBuffer = await bufferCompressor.compress(buffer);
                } catch (error) {
                    console.error(`Error in compressing file ${fileName}`, error);
                    outputBuffer = buffer;
                }
            }
            return outputBuffer;
    }
}
import { fromBuffer, FileExtension, MimeType } from 'file-type';
export interface BufferCompressor {
    compress(buffer: Buffer): Promise<Buffer>;
}

export class BufferDetails {
    public readonly buffer: Buffer;
    public readonly ext: FileExtension;
    public readonly mime: MimeType;
    public readonly fileName: string;
    public readonly sizeInMb: number;

    public static BUFFER_TYPES = {
        IMAGE: ['jpg', 'jpeg', 'png', 'webp', 'jp2', 'tiff', 'tif', 'avif', 'heif', 'jxl'],
        VIDEO: ['mp4', 'avi', 'mov', 'mkv', 'wmv'],
        PDF: ['pdf'],
    }

    private constructor(fileName: string, buffer: Buffer, ext: FileExtension, mime: MimeType) {
        this.fileName = fileName;
        this.buffer = buffer;
        this.ext = ext;
        this.mime = mime;
        this.sizeInMb = (buffer.length / (1024 * 1024));
    }

    public static async from(fileName: string, buffer: Buffer): Promise<BufferDetails> {

        const fileType = require('file-type');

        console.log(fileType);

        const { ext, mime } = await fromBuffer(buffer);
        const bufferDetails =  new BufferDetails(fileName, buffer, ext, mime);
        return bufferDetails;
    }

    public isImage(): boolean {
        return BufferDetails.BUFFER_TYPES.IMAGE.includes(this.ext) || this.mime.indexOf('image') !== -1;
    }

    public isVideo(): boolean {
        return BufferDetails.BUFFER_TYPES.VIDEO.includes(this.ext) || this.mime.indexOf('video') !== -1;
    }

    public isPdf(): boolean {
        return BufferDetails.BUFFER_TYPES.PDF.includes(this.ext) || this.mime.indexOf('pdf') !== -1;
    }
}
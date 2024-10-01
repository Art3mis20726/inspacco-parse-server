import { BufferCompressor, BufferDetails } from "./interfaces";
import sharp, { FormatEnum } from 'sharp';

type ImageType = keyof FormatEnum;

export class ImageBufferCompressor implements BufferCompressor {

    constructor(private readonly inputBufferDetails: BufferDetails) {
        
    }

    public async compress(): Promise<Buffer> {

        const quality = this.getExpectedCompressionQuality();

        if(quality === 100) {
            return this.inputBufferDetails.buffer;
        }

        let image = sharp(this.inputBufferDetails.buffer);
        const metadata = await image.metadata();

        const width = Math.round(metadata.width * quality / 100);
        const height = Math.round(metadata.height * quality / 100);

        image = image.resize({ width, height });

        const format: ImageType | undefined = metadata.format;
        switch(format) {
            case 'jpeg':
            case 'jpg':
                image =  image.jpeg({ quality, chromaSubsampling: '4:2:0', progressive: true });
                break;
            case 'png':
                image =  image.png({ quality, compressionLevel: 9, adaptiveFiltering: true });
                break;
            case 'webp':
                image =  image.webp({ quality, effort: 6 });
                break;
            case 'jp2':
                image =  image.jp2({ quality, chromaSubsampling: '4:2:0', lossless: true, });
                break;
            case 'tiff':
            case 'tif':
                image =  image.tiff({ quality });
                break;
            case 'avif':
                image =  image.avif({ quality, chromaSubsampling: '4:2:0', lossless: true, effort: 6 });
                break;
            case 'heif':
                image =  image.heif({ quality, chromaSubsampling: '4:2:0', lossless: true, effort: 6 });
                break;
            case 'jxl':
                image =  image.jxl({ quality, effort: 6, lossless: true });
                break;
        }

        return image.toBuffer();
    }

    private getExpectedCompressionQuality(): number {
        let quality = 100;
        if(this.inputBufferDetails.sizeInMb > 2 && this.inputBufferDetails.sizeInMb <= 5) {
            quality = 60;
        } else if(this.inputBufferDetails.sizeInMb > 5) {
            quality = 30;
        }

        return quality;
    }
    
}
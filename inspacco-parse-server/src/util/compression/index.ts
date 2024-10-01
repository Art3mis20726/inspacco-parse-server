import { ImageBufferCompressor } from "./image-compression";
import { BufferCompressor, BufferDetails } from "./interfaces";

const MAX_IMAGE_SIZE_IN_MB = 10;
const MAX_VIDEO_SIZE_IN_MB = 200;

export async function getBufferCompressor(fileName: string, buffer: Buffer): Promise<BufferCompressor | null> {

  const bufferDetails = await BufferDetails.from(fileName, buffer);
  validateBufferDetails(bufferDetails);

    if(bufferDetails.isImage()) {
        return new ImageBufferCompressor(bufferDetails);
    }

    return null;
}

function validateBufferDetails(bufferDetails: BufferDetails): void {
  const isImage = bufferDetails.isImage();
  const isVideo = bufferDetails.isVideo();

  if(isImage && bufferDetails.sizeInMb > MAX_IMAGE_SIZE_IN_MB) {
    throw new Error(`Image size should be less than ${MAX_IMAGE_SIZE_IN_MB} MB`);
  } else if(isVideo && bufferDetails.sizeInMb > MAX_VIDEO_SIZE_IN_MB) {
    throw new Error(`Video size should be less than ${MAX_VIDEO_SIZE_IN_MB} MB`);
  }
}
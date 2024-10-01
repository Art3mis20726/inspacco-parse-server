/* eslint-disable @typescript-eslint/no-explicit-any */
import { Attachment } from '../../models';
import { S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_REGION } from '../../util/secrets';

import archiver from 'archiver';
import AsyncLock from 'async-lock';
import { PassThrough } from 'stream';

const lock = new AsyncLock();

const S3Adapter = require('parse-server').S3Adapter;
const s3FileAdaptor = new S3Adapter(S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, {
  directAccess: false,
  region: S3_REGION,
});


interface DownloadAttachmentsRequest {
    ids: string[];
    attachmentTypes: string[];
}

const ATTACHMENT_FOLDER_TYPE_MAP = {
    SERVICE_REQUEST_RESOLUTION_ATTACHMENT: 'completion_attachments',
    SERVICE_REQUEST_PO_ATTACHMENT: 'po_attachments',
};

interface AttachmentDocumentType {
    _id: string;
    name: string;
    fileName: string;
    url: string;
    module: string;
    serviceRequest: {
        _id: string;
        displayId: number;
    }
}

export async function downloadAttachments(request: DownloadAttachmentsRequest): Promise<PassThrough> {
    const query = getQuery(request);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    const pass = new PassThrough();

    archive.pipe(pass);


    const cursor = Attachment.aggregate(query).cursor({ batchSize: 1000 }).exec();
    await cursor.eachAsync(async (doc: AttachmentDocumentType) => {
        const attachmentFolder = ATTACHMENT_FOLDER_TYPE_MAP[doc.module] || 'other_attachments';
        try {
                const buffer = await s3FileAdaptor.getFileData(doc.url);
                await lock.acquire('archive', async () => {
                    archive.append(buffer, { name: `${doc.serviceRequest.displayId}/${attachmentFolder}/${doc.fileName}` });
                });
        } catch(err) {
                const buffer = Buffer.from(`Error in downloading attachment ${doc.fileName} from url ${doc.url} with error ${err}`, 'utf-8');
                await lock.acquire('archive', async () => {
                    archive.append(buffer, { name: `${doc.serviceRequest.displayId}/${attachmentFolder}/${doc.fileName}_error.txt` });
                });
        }
    }, { parallel: 1000 });
    
    await archive.finalize();
    
    return pass;
}

function getQuery(request: DownloadAttachmentsRequest): any[] {
    return [
        { $match: { parentId: { $in: request.ids }, module: { $in: request.attachmentTypes} } },
        {
            $lookup: {
                   from: "ServiceRequest",
                   localField: "parentId",
                   foreignField: "_id",
                   as: "serviceRequest"
                 }
        },
        { $unwind: "$serviceRequest" },
        { $project: { _id: 1, serviceRequest: { _id: '$parentId', displayId: '$serviceRequest.displayId'}, fileName: 1, url: 1, name: 1, module: 1,  } }
    ];
}
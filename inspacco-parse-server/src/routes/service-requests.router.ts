import express from 'express';
import { downloadAttachments } from '../services/service-requests';
export const router = express.Router({ mergeParams: true });

router.post('/attachments/download', async (req, res,next) => {
    try {
        const result = await downloadAttachments(req.body);
        // Set response headers for downloading the ZIP file
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=service_requests_attachments.zip');

        // Pipe the PassThrough stream to the response
        result.pipe(res);
    } catch(error) {
        console.log(error);
        next(error)
        res.status(500).json({ message: 'Internal server error', error });
    }
});
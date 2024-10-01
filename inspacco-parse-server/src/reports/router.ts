/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { getReports } from './service';
import ExcelJS from 'exceljs';
// import rollbar from 'src/util/rollbar';

export const router = express.Router({ mergeParams: true });

router.post('/', async (req, res,next) => {
    try {
        const result: any[] = await getReports(req.body) as any[];
        const format = req.body.format || 'json';
        if(format === 'json') {
            res.json(result);   
        } else {
            const workbook = await getExcelData(result);
            const fileName = 'reports.xlsx';

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader("Content-Disposition", "attachment; filename=" + fileName);

            await workbook.xlsx.write(res);
            res.end();
        }
    } catch(error) {
        // console.log(error);
        next(error);
        // res.status(500).json({ message: 'Internal server error', error });
    }
});

// get excel data
async function getExcelData(result: any[]): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Client Report');

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Reference Number', key: 'referenceNumber', width: 50 },
        { header: 'Service Name', key: 'serviceName', width: 50 },
        { header: 'Owner', key: 'owner', width: 50 },
        { header: 'State', key: 'state', width: 50 },
        { header: 'City', key: 'city', width: 50 },
        { header: 'Opening Status', key: 'openingStatus', width: 50 },
        { header: 'Closing Status', key: 'closingStatus', width: 50 },
        { header: 'Current Status', key: 'currentStatus', width: 50 },
    ];

    worksheet.getRow(1).font = { bold: true };
    // worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0047B3' } };

    result.forEach((item) => {
        worksheet.addRow(item);
    });

    return workbook;
}
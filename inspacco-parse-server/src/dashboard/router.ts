import express from 'express';
import { getDashboardData } from './service';
export const router = express.Router({ mergeParams: true });

router.post('/', async (req, res,next) => {
    try {
        console.log("gcfuubg");
        const result = await getDashboardData(req.body);
        
        res.json(result);
    } catch(error) {
        console.log(error);
        next(error)
        // res.status(500).json({ message: 'Internal server error', error });
    }
});
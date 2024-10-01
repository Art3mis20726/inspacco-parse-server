import _ from 'lodash';
import express from 'express';
const router = express.Router({ mergeParams: true });
import Partner from '../models/Partner';
import { uploadBookings } from '../controllers/bookings';
import multer from 'multer';
import { getSchemaFindQuery } from '../util';
import { COLLECTIONS } from '../constants/common';
import { handleBulkVendorUploadRequest } from '../controllers/partner';
import { router as dashboardRouter } from '../dashboard';
import { router as reportsRouter } from '../reports';
import { router as serviceRequestsRouter } from './service-requests.router';

const upload = multer({ dest: 'tmp/csv/' });
interface Experience {
  $gte: number;
  $lte: number;
}

interface Regex {
  $regex: string,
  $options: string
}

interface FilterParams {
  experience?: Experience;
  fullAddress?: Regex;
  serviceNames?: Regex;
  term?: string
}

interface QueryParams {
  experience: {
    min: string;
    max: string;
  };
  serviceName: string;
  fullAddress: string;
  term: string;
}

function getFilterParams(request): FilterParams {
  const q: QueryParams = request.query.q;
  const filterParams: FilterParams = {};
  if (q) {
    const expObj = q.experience;
    if (expObj) {
      filterParams.experience = {
        $gte: parseInt(expObj.min as string),
        $lte: parseInt(expObj.max as string)
      };
    }

    const fullAddress = q.fullAddress as string;
    if (fullAddress) {
      const addressRegex: Regex = {
        $regex: fullAddress,
        $options: 'i'
      };
      filterParams.fullAddress = addressRegex;
    }

    const serviceName = q.serviceName as string;
    if (serviceName) {
      const serviceNameRegex: Regex = {
        $regex: serviceName,
        $options: 'i'
      };
      filterParams.serviceNames = serviceNameRegex;
    }
    //filterParams.term = q.term;
  }
  return filterParams;
}

router.get('/partners/search', async function (request, response, next) {
  const pipeline = [];
  const query = request.query;

  const page = parseInt((query.page as string) || '1');
  const limit = parseInt(query.per as string || '10');
  const skip = (page - 1) * limit;
  const filterParams: FilterParams = getFilterParams(request);
  if (filterParams.term) {
    pipeline.push({
      $search: {
        index: 'txt_idx_partners',
        text: {
          query: filterParams.term,
          path: ['name', 'serviceNames', 'fullAddress'],
          fuzzy: { maxEdits: 2 }
        }
      }
    });
    delete filterParams['term'];
  }

  if (filterParams) {
    pipeline.push({
      $match: filterParams
    });
  }

  pipeline.push({
    $lookup: {
      from: 'Attachment',
      localField: '_id',
      foreignField: 'parentId',
      as: 'attachments'
    }
  });

  //pipeline.push({ $skip: skip });
  //pipeline.push({ $limit: limit });

  pipeline.push({
    $project: {
      objectId: 1,
      name: 1,
      estd: 1,
      numberOfClients: 1,
      serviceNames: 1,
      area: "$address.area",
      city: "$address.city",
      attachments: 1,
      verified: 1,
      rating: 1,
      logoName: 1,
      experience: 1,
      description: 1,
      rankingScore: 1,
      slug: 1,
      searchScore: "$meta.searchScore"
    }
  });

  pipeline.push({
    $sort: {
      rankingScore: -1
    }
  });

  //console.log("Skip: "+skip)
  //console.log("Limit: "+limit)

  pipeline.push({
    '$facet': {
      metadata: [
        { $count: "total" },
        {
          $addFields: {
            page: page
          }
        }
      ],
      data: [
        { $skip: skip },
        { $limit: limit }
      ]
    }
  });
  const queryResponse = await Partner.aggregate(
    pipeline
  ).exec();

  response.send({
    data: queryResponse[0].data,
    metadata: queryResponse[0].metadata
  });
});

router.get('/services', async function (req, res) {
  const services = await getSchemaFindQuery(COLLECTIONS.SERVICE)({ status: 'Active' }, null);
  res.json(services);
});
router.post('/upload/vistabookings', upload.single('file'), uploadBookings);
router.post('/upload/partners', upload.single('file'), handleBulkVendorUploadRequest);

router.use('/dashboard', dashboardRouter);
router.use('/reports', reportsRouter);
router.use('/service-requests', serviceRequestsRouter);
export default router;
module.exports = router;

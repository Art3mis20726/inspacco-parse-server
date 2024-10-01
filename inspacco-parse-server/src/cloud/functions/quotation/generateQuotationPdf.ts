const pdf = require('html-pdf');
import { existsSync } from 'fs';
import { compact, get, isEmpty, size } from 'lodash';
import moment from 'moment';
import { renderFile } from 'pug';
import { GET_QUOTATION } from '../../../cloud/graphql/queries/getServiceRequest';
import executeGraphql from '../../../util/graphqlClient';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';
import rollbar from '../../../util/rollbar';

async function getQuotationData(req: Parse.Cloud.FunctionRequest) {
  const { serviceRequestId, quotationId } = req.params;
  const quotationRes = await executeGraphql(req.user, GET_QUOTATION, {
    serviceRequestId,
    quotationId,
  });
  return get(quotationRes, 'data.serviceRequest');
}

async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  console.log('################ GENERATE PDF ###############');
  const quotationData = await getQuotationData(req);
  const subTotal = get(quotationData, 'quotations.edges[0].node.actualAmount');
  const otherChargesPercentage = get(
    quotationData,
    'quotations.edges[0].node.otherCharges'
  );
  const otherCharges = Math.round((subTotal * otherChargesPercentage) / 100);

  const discountPercentage = get(
    quotationData,
    'quotations.edges[0].node.discount'
  );
  const discount = Math.round(
    ((subTotal + otherCharges) * discountPercentage) / 100
  );

  const taxPercentage = get(quotationData, 'quotations.edges[0].node.tax');
  const tax = Math.round(
    ((subTotal + otherCharges - discount) * taxPercentage) / 100
  );
  const grandTotal = subTotal + otherCharges - discount + tax;

  return new Promise((resolve, reject) => {
    try {
      pdf
        .create(
          renderFile('./src/cloud/functions/quotation/template/quotation.pug', {
            quotationDate: moment(
              get(quotationData, 'quotations.edges[0].node.createdAt')
            )
              .utcOffset('+0530')
              .format('D MMM YYYY'),
            quotationNumber: get(
              quotationData,
              'quotations.edges[0].node.displayId'
            ),
            requesterName: compact([
              get(quotationData, 'requester.firstName'),
              get(quotationData, 'requester.lastName'),
            ]).join(' '),
            societyAddress: get(quotationData, 'society.area')
              ? compact([
                  get(quotationData, 'society.area'),
                  get(quotationData, 'society.city'),
                ]).join(', ')
              : false,
            requesterMobile: get(quotationData, 'requester.mobileNumber'),
            serviceName: get(quotationData, 'service.name'),
            requestFirstName: get(quotationData, 'requester.firstName'),
            serviceRequestDate: moment(get(quotationData, 'createdAt'))
              .utcOffset('+0530')
              .format('D MMM YYYY'),
            items: get(
              quotationData,
              'quotations.edges[0].node.items.edges'
            ).map(({ node }) => {
              return {
                serialNumber: node.serialNumber,
                serviceDescription: node.serviceDescription,
                quantity: node.quantity,
                rate: node.rate.toLocaleString('en-IN'),
                amount: (<number>node.amount).toLocaleString('en-IN'),
              };
            }),
            subTotal: subTotal.toLocaleString('en-IN'),
            otherChargesPercentage,
            otherCharges: otherCharges.toLocaleString('en-IN'),
            taxPercentage,
            tax: tax.toLocaleString('en-IN'),
            discountPercentage,
            discount: discount.toLocaleString('en-IN'),
            grandTotal: grandTotal.toLocaleString('en-IN'),
            scopeItems: (<string>(
              get(quotationData, 'quotations.edges[0].node.note', '')
            ))
              .split(/\r?\n/)
              .filter((item) => !isEmpty(item.trim())),
          }),
          {
            format: 'Letter',
            border: {
              top: '50px',
              left: '50px',
              bottom: '50px',
              right: '50px',
            },
            phantomPath: existsSync(
              './node_modules/phantomjs-prebuilt/bin/phantomjs'
            )
              ? './node_modules/phantomjs-prebuilt/bin/phantomjs'
              : '/node_modules/phantomjs-prebuilt/bin/phantomjs',
          }
        )
        .toBuffer(function (err, buffer) {
          if (err) return console.log(err);
          const file = new Parse.File(
            'quotation.pdf',
            Array.from(Buffer.from(buffer))
          );
          file.save().then((res) => {
            resolve(res.url());
          });
        });
    } catch (error) {
      rollbar.error(`${quotationData} quotation not generated ${error.message}`);
      
      reject('Failed to generate quotation');
    }
  });
}

export const generateQuotationPdf = {
  execute,
};

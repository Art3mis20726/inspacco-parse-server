import { Schema, model } from 'mongoose';

const partnerSchema = new Schema({
  name: String,
  serviceNames: String
}, {
  collection: 'Partner'
});

const Partner = model('Partner', partnerSchema);

export default Partner;
module.exports = Partner;

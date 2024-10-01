import logger from './logger';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}
export const ENVIRONMENT = process.env.NODE_ENV;
export const isProd = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const DATABASE_URI = `${process.env['DATABASE_URI']}`;
export const APP_ID = process.env['APP_ID'];
export const API_KEY = process.env.API_KEY;
export const MASTER_KEY = process.env['MASTER_KEY'];
export const REST_API_KEY = process.env['REST_API_KEY'];
const port = process.env['PORT'] || 1337;

export const SERVER_PORT = port;
export const SERVER_URL =
  process.env['SERVER_URL'] || `http://localhost:${port}/parse`;

export const S3_ACCESS_KEY = process.env['S3_ACCESS_KEY'];
export const S3_SECRET_KEY = process.env['S3_SECRET_KEY'];
export const S3_BUCKET = process.env['S3_BUCKET'];
export const S3_REGION = process.env['S3_REGION'];

export const SMS_USER = process.env['SMS_USER'];
export const SMS_PWD = process.env['SMS_PWD'];
export const SMS_SENDER_ID = process.env['SMS_SENDER_ID'];
export const SMS_ENTITY_ID = process.env['SMS_ENTITY_ID'];

export const EMAIL_ID = process.env['EMAIL_ID'];
export const EMAIL_PWD = process.env['EMAIL_PWD'];

export const FIREBASE_SERVER_KEY = process.env['FIREBASE_SERVER_KEY'];

export const ATTACHMENTS_BASE_URL = process.env['ATTACHMENTS_BASE_URL'];
export const FACE_RECOGNITION_BASE_URL = process.env['FACE_RECOGNITION_BASE_URL'];
export const AZURE_FACE_ENDPOINT = process.env['AZURE_FACE_ENDPOINT'];
export const AZURE_FACE_SUBSCRIPTION_KEY = process.env['AZURE_FACE_SUBSCRIPTION_KEY'];
if (!DATABASE_URI) {
  logger.error(
    'No mongo connection string. Set MONGODB_URI environment variable.'
  );
  process.exit(1);
}

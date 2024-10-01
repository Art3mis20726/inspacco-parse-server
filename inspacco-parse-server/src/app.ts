/* eslint-disable @typescript-eslint/no-namespace */
import express from 'express';
// import fs from 'fs';
import path from 'path';
import {
  APP_ID,
  API_KEY,
  DATABASE_URI,
  MASTER_KEY,
  S3_ACCESS_KEY,
  S3_SECRET_KEY,
  S3_BUCKET,
  S3_REGION,
  SERVER_URL,
  isProd,
} from './util/secrets';
import PhoneAuthAdaptor from './adapters/phone-auth-adapter';
import mongodb from './util/mongodbClient';
import { createConfigData, createSchemas } from './schema';
import { createEmailTransport } from './util/email';
import { createSesEmailTransport } from './util/ses';
import { getConfig } from './util/config';
import cors from 'cors';
import api from './routes/api';
// import gql from 'graphql-tag';
import { authenticateMiddleware, currentUserMiddleware, graphqlPerformanceMiddleware } from './middlewares';
import { InspaccoFileAdaptor } from './util/fileAdaptor';
import { log } from 'console';
import rollbar from './util/rollbar';

require('./db/mongodb');

// *********************************************************************************************

interface ApplicationContext {
  sessionToken?: string;
    session?: Parse.Session;
    user?: Parse.User;
    roles?: Parse.Role[];
    master: boolean;
}

declare global {
    namespace Express {
      interface Request {
        context?: ApplicationContext
      }
    }
}

// *********************************************************************************************


// eslint-disable-next-line
const { default: ParseServer, ParseGraphQLServer } = require('parse-server');
// eslint-disable-next-line
const S3Adapter = require('parse-server').S3Adapter;
const S3FileAdaptor = new S3Adapter(S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, {
  directAccess: false,
  region: S3_REGION,
});
const inspaccoFileAdaptor = new InspaccoFileAdaptor(S3FileAdaptor);

// Create Express server
const app = express();

mongodb.connect();
createEmailTransport();
createSesEmailTransport();

const parseServer = new ParseServer({
  maxUploadSize: '200mb',
  databaseURI: DATABASE_URI,
  cloud: path.join(__dirname, '/cloud/main.js'),
  appId: APP_ID,
  masterKey: MASTER_KEY,
  // restAPIKey: REST_API_KEY,
  allowOrigin: "*",
  serverURL: SERVER_URL,
  auth: { phoneAuth: PhoneAuthAdaptor },
  filesAdapter: inspaccoFileAdaptor,
  serverStartComplete: async () => {
    const executeScriptOnStart = await getConfig('EXECUTE_SCHEMA_ON_SERVER_START', true);
    if (executeScriptOnStart) {
      createSchema();
    } else {
      console.log('  ');
      console.log("### Schema create not executed. ####");
      console.log("Config value either not available or false for : ", "EXECUTE_SCHEMA_ON_SERVER_START");
    }
  },
});

async function createSchema() {
  console.log('  ');
  console.log(
    '##########  Migration Script for Schema & Data Excecution Started  ##########'
  );
  try {
    await createSchemas();
    console.log('  ');
    await createConfigData();
    console.log('  ');
    console.log(
      '########## 🚀🚀🚀  Migration Script for Schema & Data imported successfully. 🚀🚀🚀 ##########'
    );
  } catch (error) {
    console.log('  ');
    console.log('########## Error in Schema & Data Import ##########');
    console.log(error);
    console.log('  ');
  }
}

// const customSchema = fs.readFileSync(path.join(__dirname, 'cloud', 'schema.graphqls'));

// Create the GraphQL Server Instance
const parseGraphQLServer = new ParseGraphQLServer(parseServer, {
  graphQLPath: '/graphql',
  playgroundPath: '/playground',
  // graphQLCustomTypeDefs: gql`${customSchema}`,
});

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.options('*', cors());
app.use(cors());
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-parse-application-id, x-parse-session-token");
  next();
});
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use(express.json({ limit: '200mb' }));

app.get('/', function (req, res) {
  res.send('ACK');
});
app.use('/public', express.static('public'));

// (Optional) Mounts the REST API
app.use('/parse', parseServer.app);

app.use(currentUserMiddleware());
app.use(authenticateMiddleware());

app.use('/api', api);
// Setup GraphQL middlewares
app.use(graphqlPerformanceMiddleware());
app.use(rollbar.errorHandler());
// 1. Mounts the GraphQL API using graphQLPath: '/graphql'
parseGraphQLServer.applyGraphQL(app);

// 2. (Optional) Mounts the GraphQL Playground - do NOT use in Production
if (!isProd) parseGraphQLServer.applyPlayground(app);



export default app;

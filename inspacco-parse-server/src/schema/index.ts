import { schemas } from './schemas';
import { buildSchemas } from './buildSchemas';
import { importConfigData } from './config-data';

export const createSchemas = async () => buildSchemas(schemas);
export const createConfigData = async() => importConfigData();

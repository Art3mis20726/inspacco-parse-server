import { isEqual } from 'lodash';
import mongodb from '../util/mongodbClient';

export const buildSchemas = async (localSchemas: any[]) => {

	if(!mongodb.client() || mongodb.client().isConnected()) {
		await mongodb.connect();
	}

	const allCloudSchema = (await Parse.Schema.all()).filter(
		(s: any) => !lib.isDefaultSchema(s.className),
	);
	await Promise.all(
		localSchemas.map(async (localSchema) => lib.saveOrUpdate(allCloudSchema, localSchema)),
	);
};

export const lib = {
	saveOrUpdate: async (allCloudSchema: any[], localSchema: any) => {
		const cloudSchema = allCloudSchema.find((sc) => sc.className === localSchema.className);
		if (cloudSchema) {
			await lib.updateSchema(localSchema, cloudSchema);
		} else {
			await lib.saveSchema(localSchema);
		}
	},
	saveSchema: async (localSchema: any) => {
		const newLocalSchema = new Parse.Schema(localSchema.className);		
		// Handle fields
		Object.keys(localSchema.fields)
			.filter((fieldName) => !lib.isDefaultFields(localSchema.className, fieldName))
			.forEach((fieldName) => {				
				console.log("++++ Creating new field : ",localSchema.className,'-->',fieldName,"++++++");
				const { type, ...others } = localSchema.fields[fieldName];
				lib.handleFields(newLocalSchema, fieldName, type, others);
			});
		// Handle indexes
		if (localSchema.indexes) {
			Object.keys(localSchema.indexes).forEach((indexName) =>
				newLocalSchema.addIndex(indexName, localSchema.indexes[indexName]),
			);
		}
		newLocalSchema.setCLP(localSchema.classLevelPermissions);
		const savedSchema = await newLocalSchema.save();

		// handle db indexes
		await lib.createDbIndexesIfRequired(localSchema);
		return savedSchema;
	},
	updateSchema: async (localSchema: any, cloudSchema: any) => {
		const newLocalSchema: any = new Parse.Schema(localSchema.className);

		// Handle fields
		// Check addition
		Object.keys(localSchema.fields)
			.filter((fieldName) => !lib.isDefaultFields(localSchema.className, fieldName))
			.forEach((fieldName) => {
				const { type, ...others } = localSchema.fields[fieldName];
				if (!cloudSchema.fields[fieldName]){
					console.log("*********** Updating : ",localSchema.className,'-->',fieldName," field.");
					lib.handleFields(newLocalSchema, fieldName, type, others);
				}
			});

		// Check deletion
		await Promise.all(
			Object.keys(cloudSchema.fields)
				.filter((fieldName) => !lib.isDefaultFields(localSchema.className, fieldName))
				.map(async (fieldName) => {
					const field = cloudSchema.fields[fieldName];
					if (!localSchema.fields[fieldName]) {			
						console.log("*********** Deleting Cloud field from : ",localSchema.className,'-->',fieldName);
						newLocalSchema.deleteField(fieldName);
						await newLocalSchema.update();
						return;
					}
					const localField = localSchema.fields[fieldName];
					if (!lib.paramsAreEquals(field, localField)) {
						console.log("*********** Deleting  Local field  from",localSchema.className,'-->',fieldName);
						newLocalSchema.deleteField(fieldName);
						await newLocalSchema.update();
						const { type, ...others } = localField;
						lib.handleFields(newLocalSchema, fieldName, type, others);
					}
				}),
		);

		// Handle Indexes
		// Check addition
		const cloudIndexes = lib.fixCloudIndexes(cloudSchema.indexes);

		if (localSchema.indexes) {

			Object.keys(localSchema.indexes).forEach((indexName) => {
				if (
					!cloudIndexes[indexName] &&
					!lib.isNativeIndex(localSchema.className, indexName)
				){
					newLocalSchema.addIndex(indexName, localSchema.indexes[indexName]);
				}
			});
		}

		const indexesToAdd: any[] = [];

		// Check deletion
		Object.keys(cloudIndexes).forEach(async (indexName) => {
			if (!lib.isNativeIndex(localSchema.className, indexName)) {
				if (!localSchema.indexes[indexName]) {
					//console.log("Deleted index  for :",localSchema.className,'-->' , indexName);
					newLocalSchema.deleteIndex(indexName);
				} else if (
					!lib.paramsAreEquals(localSchema.indexes[indexName], cloudIndexes[indexName])
				) {
					console.log("Add index  for :",localSchema.className,'-->' , indexName);
					newLocalSchema.deleteIndex(indexName);
					indexesToAdd.push({
						indexName,
						index: localSchema.indexes[indexName],
					});
				}
			}
		});
		newLocalSchema.setCLP(localSchema.classLevelPermissions);
		await newLocalSchema.update();
		indexesToAdd.forEach((o) => newLocalSchema.addIndex(o.indexName, o.index));
		const savedSchema = newLocalSchema.update();

		// handle db indexes
		await lib.createDbIndexesIfRequired(localSchema);

		return savedSchema;
	},

	isDefaultSchema: (className: string) =>
		['_Session', '_Role', '_PushStatus', '_Installation'].indexOf(className) !== -1,

	isDefaultFields: (className: string, fieldName: string) =>
		[
			'objectId',
			'createdAt',
			'updatedAt',
			'ACL',
			'emailVerified',
			'authData',
			'username',
			'password',
			'email',
		]
			.filter(
				(value) => (className !== '_User' && value !== 'email') || className === '_User',
			)
			.indexOf(fieldName) !== -1,

	fixCloudIndexes: (cloudSchemaIndexes: any) => {
		if (!cloudSchemaIndexes) return {};
		const { _id_, ...others } = cloudSchemaIndexes;

		return {
			objectId: { objectId: 1 },
			...others,
		};
	},

	isNativeIndex: (className: string, indexName: string) => {
		if (className === '_User') {
			switch (indexName) {
				case 'username_1':
					return true;
				case 'objectId':
					return true;
				case 'email_1':
					return true;
				default:
					break;
			}
		}
		return false;
	},

	paramsAreEquals: (indexA: any, indexB: any) => {
		const keysIndexA = Object.keys(indexA);
		const keysIndexB = Object.keys(indexB);
		// Check key name
		if (keysIndexA.length !== keysIndexB.length) return false;

		return keysIndexA.every(function(k){
		  const eql = isEqual(indexA[k],indexB[k]);
		  //console.log(eql);
		  return eql;
		});
	},

	handleFields: (newLocalSchema: Parse.Schema, fieldName: string, type: string, others: any) => {
		if (type === 'Relation') {
			newLocalSchema.addRelation(fieldName, others.targetClass);
		} else if (type === 'Pointer') {
			const { targetClass, ...others2 } = others;
			newLocalSchema.addPointer(fieldName, targetClass, others2);
		} else {
			newLocalSchema.addField(fieldName, type as Parse.Schema.TYPE, others);
		}
	},

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	createDbIndexesIfRequired: async (localSchema: any): Promise<void> => {
		if (localSchema.dbIndexes) {
			const mongoClient = mongodb.client();
			const collectionName = localSchema.className;

			const collection = mongoClient.db().collection(collectionName);

			await Promise.all(localSchema.dbIndexes.map(async (dbIndex): Promise<void> => {
				const { name, keys, options } = dbIndex;
				console.log(`Creating index ${name} for ${collectionName}`);
				try {
					await collection.createIndex(keys, { ...options, name });
				} catch(error) {
					console.error(`Error on creating index ${name} for ${collectionName} : ${error.message}`);
					await collection.dropIndex(name);
					try {
						await collection.createIndex(keys, { ...options, name });
					} catch(error) {
						console.error(`Final Error on creating index ${name} for ${collectionName} : ${error.message}`);
					}
				}
			}));
		}
		return;
	}
};

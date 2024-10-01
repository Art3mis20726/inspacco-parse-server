import { isEmpty } from 'lodash';
import { MASTER_KEY, SERVER_PORT } from './secrets';
import rollbar from './rollbar';
import { use } from 'chai';
global.fetch = require('node-fetch');
export default async function executeGraphql(
  user,
  query,
  params,
  useMasterKey: boolean = false
) {
  return executeGraphqlWithOperationName(user, query, params, null, useMasterKey);
}

export async function executeGraphqlWithOperationName(
  user,
  query,
  params,
  operationName,
  useMasterKey: boolean = false
) {
  const graphqlURL = `http://localhost:${SERVER_PORT || '1337'}/graphql`;
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Parse-Application-Id': 'inspacco-parse-server',
    };

    if (useMasterKey && !isEmpty(MASTER_KEY)) {
      headers['X-Parse-Master-Key'] = MASTER_KEY;
      if(user) {
        headers['x-inspacco-user-session-token'] = user.getSessionToken();
        headers['x-inspacco-user-id'] = user.id;
      }
    } else {
      headers['X-Parse-Session-Token'] = user.get('sessionToken');
    }

    const json = {
      query,
      variables: params,
    };
    if (operationName) {
      json['operationName'] = operationName;
    }

    const getResponse = await fetch(graphqlURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(json),
    });
    return await getResponse.json();
  } catch (error) {
    rollbar.error(`GraphQl execution Failed with operation name ${user} ${error.message}`)
    return Promise.reject(error);
  }
}
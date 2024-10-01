import * as Parse from 'parse/node';

export async function getConfig(name: string, useMasterKey: boolean = false) {
  const config = await Parse.Config.get({ useMasterKey });
  return config.get(name);
}

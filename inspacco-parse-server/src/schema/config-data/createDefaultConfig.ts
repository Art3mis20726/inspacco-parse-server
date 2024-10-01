import { getConfig } from '../../util/config';
import { DEFAULT_CONFIGS, IConfig } from './data/DefaultConfigs';

export const createDefaultConfig = async () => {
  console.log('------------- Import Default Config ----------------');
  for await (const config of DEFAULT_CONFIGS) {
    await _createConfig(config);
  }
};

const _createConfig = async (config: IConfig) => {
  const isPresent = await getConfig(config.name,true); 
  if (isPresent) {
    console.log(`${config.name} config is already exist.`);
    return;
  } else{
    await Parse.Config.save(
      config.value,
      {useMasterKey:config.useMasterKey}
    );
    console.log(`++ ${config.name} config is created sucesfully.`);
  }
};

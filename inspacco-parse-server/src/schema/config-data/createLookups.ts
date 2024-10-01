import { size } from 'lodash';
import { LookupsData } from './data/Lookups';

export const createLookups = async () => {
  console.log('------------- Create Lookups ----------------');
  for await (const lookup of LookupsData) {
    await _createLookup(lookup);
  }
};

const _createLookup = async (lookup: { value: string; type: string }) => {
  const Lookup = Parse.Object.extend('Lookup');

  const isPresent = await new Parse.Query(Lookup)
    .equalTo('value', lookup.value)
    .equalTo('type', lookup.type)
    .first({ useMasterKey: true });
  if (size(isPresent)) {
    console.log(
      `Lookup ${lookup.type} - ${lookup.value} already exists.`
    );
    return;
  } else {
    const displayIdCounter = new Lookup();
    displayIdCounter.set('value', lookup.value);
    displayIdCounter.set('type', lookup.type);
    await displayIdCounter.save(null, { useMasterKey: true });
    console.log(
      `++ Lookup ${lookup.type} - ${lookup.value} is created succesfully.`
    );
  }
};

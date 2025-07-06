import { Mode } from '../types/mode';
import { assignStr } from './assign-str';
import { Collection } from '../types/collection';

export const varsToJson = (
  collection: Collection,
  modeName: Mode['name'],
  filter?: (name: string, value: string) => boolean,
) => {
  const modeId = collection.modes.find((mode) => mode.name === modeName).modeId;
  return collection.variables
    .map((variable) => {
      return [variable.name, variable.valuesByMode[modeId]];
    })
    .filter(([name, value]) => {
      if (filter) {
        return filter(String(name), String(value));
      }
      return true;
    })
    .reduce((obj, [name, value]) => {
      assignStr(obj, name as string, value as string);
      return obj;
    }, {});
};

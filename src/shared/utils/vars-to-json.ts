import { Mode } from '../types/mode';
import { assignStr } from './assign-str';

export const varsToJson = (vars: Variable[], modeId: Mode['modeId']) => {
  return vars
    .map((variable) => {
      return [variable.name, variable.valuesByMode[modeId]];
    })
    .reduce((obj, [name, value]) => {
      assignStr(obj, name as string, value as string);
      return obj;
    }, {});
};

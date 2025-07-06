import { Mode } from './mode';

export type Collection = {
  id: string;
  name: string;
  modes: Mode[];
  variables: Variable[];
};

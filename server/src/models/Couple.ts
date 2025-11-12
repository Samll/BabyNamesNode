import { NamePool } from './NamePool';

export interface Couple {
  id: string;
  code: string;
  parents: string[]; // Parent IDs
  namePool: NamePool;
  currentRound: number;
  superMatches: string[];
}

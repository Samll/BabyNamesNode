export interface NamePool {
  id: string;
  names: string[];
  eliminated: string[];
  roundMatches: Record<number, string[]>;
}

export type Gender = 'boy' | 'girl' | 'unisex';

export interface BabyName {
  id: string;
  name: string;
  origin?: string;
  meaning?: string;
  gender: Gender;
}

export interface RoundResult {
  roundId: string;
  matchedNames: BabyName[];
  superMatches: BabyName[];
  totalVotes: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
}

export interface PendingNamesResponse {
  names: BabyName[];
  superMatchesRemaining: number;
}

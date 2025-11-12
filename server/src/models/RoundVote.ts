export type VoteType = 'like' | 'dislike';

export interface RoundVote {
  coupleId: string;
  parentId: string;
  name: string;
  round: number;
  vote: VoteType;
  createdAt: Date;
}

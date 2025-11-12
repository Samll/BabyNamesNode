import { Model, Schema, model } from 'mongoose';

import { Couple } from '../../models/Couple';
import { Parent } from '../../models/Parent';
import { RoundVote } from '../../models/RoundVote';

const NamePreferenceSchema = new Schema(
  {
    style: { type: [String], default: [] },
    dislikedNames: { type: [String], default: [] }
  },
  { _id: false }
);

const NamePoolSchema = new Schema(
  {
    id: { type: String, required: true },
    names: { type: [String], default: [] },
    eliminated: { type: [String], default: [] },
    roundMatches: {
      type: Map,
      of: [String],
      default: {}
    }
  },
  { _id: false }
);

const CoupleSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true },
    parents: { type: [String], default: [] },
    namePool: { type: NamePoolSchema, required: true },
    currentRound: { type: Number, default: 0 },
    superMatches: { type: [String], default: [] }
  },
  { timestamps: true }
);

const ParentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true },
    preferences: { type: NamePreferenceSchema, required: true }
  },
  { timestamps: true }
);

const RoundVoteSchema = new Schema(
  {
    coupleId: { type: String, required: true, index: true },
    parentId: { type: String, required: true },
    name: { type: String, required: true },
    round: { type: Number, required: true },
    vote: { type: String, enum: ['like', 'dislike'], required: true },
    createdAt: { type: Date, required: true }
  },
  { timestamps: false }
);

export const ParentModel: Model<Parent> = model<Parent>('Parent', ParentSchema);
export const CoupleModel: Model<Couple> = model<Couple>('Couple', CoupleSchema);
export const RoundVoteModel: Model<RoundVote> = model<RoundVote>('RoundVote', RoundVoteSchema);

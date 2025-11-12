import { connectMongo, disconnectMongo } from '../src/config/database.mongo';
import { CoupleModel, ParentModel } from '../src/repositories/mongo/models';

async function seed(): Promise<void> {
  await connectMongo();

  await ParentModel.deleteMany({});
  await CoupleModel.deleteMany({});

  await ParentModel.insertMany([
    {
      id: 'parent-1',
      email: 'alex@example.com',
      passwordHash: '$2a$10$seededhashvaluealex',
      displayName: 'Alex',
      preferences: { style: ['classic'], dislikedNames: ['Logan'] }
    },
    {
      id: 'parent-2',
      email: 'jordan@example.com',
      passwordHash: '$2a$10$seededhashvaluejordan',
      displayName: 'Jordan',
      preferences: { style: ['modern'], dislikedNames: [] }
    }
  ]);

  await CoupleModel.insertMany([
    {
      id: 'couple-1',
      code: 'FAMILY',
      parents: ['parent-1', 'parent-2'],
      currentRound: 1,
      superMatches: [],
      namePool: {
        id: 'pool-1',
        names: ['Ava', 'Mia', 'Ethan', 'Logan'],
        eliminated: [],
        roundMatches: { 1: ['Ava', 'Ethan'] }
      }
    }
  ]);

  await disconnectMongo();
}

seed()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('MongoDB seed data created successfully.');
    process.exit(0);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to seed MongoDB data', error);
    void disconnectMongo().finally(() => process.exit(1));
  });

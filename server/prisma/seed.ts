import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
  await prisma.roundVote.deleteMany();
  await prisma.couple.deleteMany();
  await prisma.parent.deleteMany();

  await prisma.parent.createMany({
    data: [
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
    ]
  });

  await prisma.couple.create({
    data: {
      id: 'couple-1',
      code: 'FAMILY',
      parents: ['parent-1', 'parent-2'],
      namePool: {
        id: 'pool-1',
        names: ['Ava', 'Mia', 'Ethan', 'Logan'],
        eliminated: [],
        roundMatches: { 1: ['Ava', 'Ethan'] }
      },
      currentRound: 1,
      superMatches: []
    }
  });
}

seed()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('MySQL seed data created successfully.');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to seed MySQL data', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

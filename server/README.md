# Baby Names API - Database Options

This service now supports running with an in-memory store (default), MongoDB using Mongoose, or MySQL using Prisma. The provider is selected through environment variables so you can switch implementations without touching the application code.

## Environment variables

Create a `.env` file in the `server/` directory with the variables that correspond to the database you want to use:

| Variable | Description | Default |
| --- | --- | --- |
| `DATABASE_PROVIDER` | `memory`, `mongo`, or `mysql`. | `memory` |
| `JWT_SECRET` | Secret used to sign JWTs. | `development-secret` |
| `MONGO_URI` | MongoDB connection string. | `mongodb://localhost:27017` |
| `MONGO_DB_NAME` | Database name to use on MongoDB. | `baby-names` |
| `DATABASE_URL` | Prisma connection URL for MySQL. Falls back to `MYSQL_URL` if present. | `mysql://root:password@localhost:3306/baby_names` |

> When `DATABASE_PROVIDER=memory` none of the MongoDB/MySQL variables are required.

## Running the API

Install dependencies and start the server from the `server/` directory:

```bash
npm install
npm run dev
```

The bootstrap process automatically initialises the repositories for the configured provider.

## MongoDB setup

1. Ensure MongoDB is running and that the URI in `MONGO_URI` is reachable.
2. Seed initial collections (optional):

   ```bash
   npx ts-node scripts/seed-mongo.ts
   ```

   The script connects using the same environment variables and populates sample parents and a couple.

## MySQL setup (Prisma)

1. Create a MySQL database and update `DATABASE_URL`.
2. Generate the Prisma client (once after installing dependencies):

   ```bash
   npx prisma generate
   ```

3. Apply the Prisma migration:

   ```bash
   npx prisma migrate deploy
   ```

   The generated SQL lives in `prisma/migrations/` if you prefer to execute it manually.

4. (Optional) Seed the database with starter data:

   ```bash
   npx ts-node prisma/seed.ts
   ```

   The seed inserts the same example parents and couple used for MongoDB.

## Switching providers

Set `DATABASE_PROVIDER` accordingly before starting the server:

```bash
# Memory (default)
DATABASE_PROVIDER=memory npm run dev

# MongoDB
DATABASE_PROVIDER=mongo MONGO_URI="mongodb://localhost:27017" npm run dev

# MySQL
DATABASE_PROVIDER=mysql DATABASE_URL="mysql://user:pass@host:3306/baby_names" npm run dev
```

Restart the server after changing providers so the new repositories are initialised.

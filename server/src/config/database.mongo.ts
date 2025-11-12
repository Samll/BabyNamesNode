import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://localhost:27017';
const DEFAULT_DB_NAME = 'baby-names';

export const connectMongo = async (): Promise<typeof mongoose> => {
  const uri = process.env.MONGO_URI ?? DEFAULT_URI;
  const dbName = process.env.MONGO_DB_NAME ?? DEFAULT_DB_NAME;
  return mongoose.connect(uri, { dbName });
};

export const disconnectMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

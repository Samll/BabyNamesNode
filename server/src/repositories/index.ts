import { DATABASE_PROVIDER } from '../config';
import { MatchService } from '../services/MatchService';
import type { NameRepository } from './NameRepository';
import type { ParentRepository } from './ParentRepository';
import { MemoryNameRepository } from './memory/NameRepository';
import { MemoryParentRepository } from './memory/ParentRepository';

type SupportedProvider = 'memory' | 'mongo' | 'mysql';

type RepositoryBundle = {
  parentRepository: ParentRepository;
  nameRepository: NameRepository;
  matchService: MatchService;
};

type ProviderModule = {
  createBundle: () => RepositoryBundle;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

let initializedProvider: SupportedProvider | null = null;
let repositories: RepositoryBundle | null = null;
let mongoModule: ProviderModule | null = null;
let mysqlModule: ProviderModule | null = null;

const createMemoryRepositories = (): RepositoryBundle => {
  const nameRepository = new MemoryNameRepository();
  const parentRepository = new MemoryParentRepository();
  const matchService = new MatchService(nameRepository);
  return { parentRepository, nameRepository, matchService };
};

const resolveProvider = (): SupportedProvider => {
  const provider = (DATABASE_PROVIDER ?? 'memory').toLowerCase();
  if (provider === 'mongo' || provider === 'mongodb') {
    return 'mongo';
  }
  if (provider === 'mysql' || provider === 'prisma') {
    return 'mysql';
  }
  return 'memory';
};

const loadMongoModule = async (): Promise<ProviderModule> => {
  if (mongoModule) {
    return mongoModule;
  }
  const [{ connectMongo, disconnectMongo }, { MongoNameRepository }, { MongoParentRepository }] = await Promise.all([
    import('../config/database.mongo'),
    import('./mongo/NameRepository'),
    import('./mongo/ParentRepository')
  ]);
  mongoModule = {
    connect: () => connectMongo(),
    disconnect: () => disconnectMongo(),
    createBundle: () => {
      const nameRepository = new MongoNameRepository();
      const parentRepository = new MongoParentRepository();
      const matchService = new MatchService(nameRepository);
      return { parentRepository, nameRepository, matchService };
    }
  };
  return mongoModule;
};

const loadMysqlModule = async (): Promise<ProviderModule> => {
  if (mysqlModule) {
    return mysqlModule;
  }
  const [{ connectMySQL, disconnectMySQL, prisma }, { PrismaNameRepository }, { PrismaParentRepository }] = await Promise.all([
    import('../config/database.mysql'),
    import('./mysql/NameRepository'),
    import('./mysql/ParentRepository')
  ]);
  mysqlModule = {
    connect: () => connectMySQL(),
    disconnect: () => disconnectMySQL(),
    createBundle: () => {
      const nameRepository = new PrismaNameRepository(prisma);
      const parentRepository = new PrismaParentRepository(prisma);
      const matchService = new MatchService(nameRepository);
      return { parentRepository, nameRepository, matchService };
    }
  };
  return mysqlModule;
};

export const initializeRepositories = async (): Promise<void> => {
  const provider = resolveProvider();
  if (provider === initializedProvider && repositories) {
    return;
  }

  if (initializedProvider === 'mongo' && mongoModule) {
    await mongoModule.disconnect();
  }

  if (initializedProvider === 'mysql' && mysqlModule) {
    await mysqlModule.disconnect();
  }

  if (provider === 'mongo') {
    const module = await loadMongoModule();
    await module.connect();
    repositories = module.createBundle();
  } else if (provider === 'mysql') {
    const module = await loadMysqlModule();
    await module.connect();
    repositories = module.createBundle();
  } else {
    repositories = createMemoryRepositories();
  }

  initializedProvider = provider;
};

const ensureRepositories = (): RepositoryBundle => {
  if (!repositories) {
    repositories = createMemoryRepositories();
    initializedProvider = 'memory';
  }
  return repositories;
};

export const getParentRepository = (): ParentRepository => ensureRepositories().parentRepository;
export const getNameRepository = (): NameRepository => ensureRepositories().nameRepository;
export const getMatchService = (): MatchService => ensureRepositories().matchService;

export const shutdownRepositories = async (): Promise<void> => {
  if (initializedProvider === 'mongo' && mongoModule) {
    await mongoModule.disconnect();
  }
  if (initializedProvider === 'mysql' && mysqlModule) {
    await mysqlModule.disconnect();
  }
  initializedProvider = null;
  repositories = null;
};

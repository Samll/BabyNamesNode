import { Parent } from '../../models/Parent';
import { ParentRepository } from '../ParentRepository';
import { ParentModel } from './models';

const toParent = (doc: Parent | null): Parent | null => {
  if (!doc) {
    return null;
  }
  const preferences = doc.preferences ?? { style: [], dislikedNames: [] };
  return {
    id: doc.id,
    email: doc.email,
    passwordHash: doc.passwordHash,
    displayName: doc.displayName,
    preferences: {
      style: [...preferences.style],
      dislikedNames: [...preferences.dislikedNames]
    }
  };
};

export class MongoParentRepository implements ParentRepository {
  public async create(parent: Parent): Promise<Parent> {
    await ParentModel.create(parent);
    return parent;
  }

  public async findByEmail(email: string): Promise<Parent | null> {
    const doc = await ParentModel.findOne({ email }).lean<Parent>().exec();
    return toParent(doc);
  }

  public async findById(id: string): Promise<Parent | null> {
    const doc = await ParentModel.findOne({ id }).lean<Parent>().exec();
    return toParent(doc);
  }
}

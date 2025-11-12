import { Parent } from '../../models/Parent';
import { ParentRepository } from '../ParentRepository';

export class MemoryParentRepository implements ParentRepository {
  private readonly parents = new Map<string, Parent>();

  public async create(parent: Parent): Promise<Parent> {
    this.parents.set(parent.id, parent);
    return parent;
  }

  public async findByEmail(email: string): Promise<Parent | null> {
    for (const parent of this.parents.values()) {
      if (parent.email === email) {
        return parent;
      }
    }
    return null;
  }

  public async findById(id: string): Promise<Parent | null> {
    return this.parents.get(id) ?? null;
  }
}

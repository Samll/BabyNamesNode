import { Parent } from '../models/Parent';

export interface ParentRepository {
  create(parent: Parent): Promise<Parent>;
  findByEmail(email: string): Promise<Parent | null>;
  findById(id: string): Promise<Parent | null>;
}

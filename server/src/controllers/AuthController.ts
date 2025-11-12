import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { JWT_SECRET, TOKEN_EXPIRATION } from '../config';
import { Parent } from '../models/Parent';
import { getParentRepository } from '../repositories';
import { generateId } from '../utils/id';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    const { email, password, displayName } = req.body as Record<string, string>;

    const parentRepository = getParentRepository();

    if (await parentRepository.findByEmail(email)) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const parent: Parent = {
      id: generateId('parent'),
      email,
      passwordHash,
      displayName,
      preferences: { style: [], dislikedNames: [] }
    };

    await parentRepository.create(parent);

    const token = jwt.sign({ parentId: parent.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
    res.status(201).json({ token, parent: { id: parent.id, displayName: parent.displayName, email: parent.email } });
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as Record<string, string>;
    const parentRepository = getParentRepository();
    const parent = await parentRepository.findByEmail(email);
    if (!parent) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValid = await bcrypt.compare(password, parent.passwordHash);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ parentId: parent.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
    res.status(200).json({ token, parent: { id: parent.id, displayName: parent.displayName, email: parent.email } });
  }
}

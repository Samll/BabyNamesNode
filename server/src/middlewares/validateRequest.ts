import { Request, Response, NextFunction } from 'express';

type FieldRule = {
  field: string;
  validate?: (value: unknown) => boolean;
  message?: string;
};

export function validateRequest(rules: FieldRule[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = (req.body as Record<string, unknown>)[rule.field];
      if (value === undefined || value === null || value === '') {
        errors.push(`${rule.field} is required`);
        continue;
      }
      if (rule.validate && !rule.validate(value)) {
        errors.push(rule.message ?? `${rule.field} is invalid`);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }

    next();
  };
}

import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AnyClass } from '../types/module';

export const validateDTO = (dtoClass: AnyClass) => {
  console.log(`+ Validation for: ${dtoClass.name}`);

  return (req: Request, res: Response, next: NextFunction) => {
    const output = plainToInstance(dtoClass, req.body);
    validate(output).then(errors => {
      if (errors.length > 0) {
        res.status(400).json(errors);
      } else {
        next();
      }
    });
  };
}

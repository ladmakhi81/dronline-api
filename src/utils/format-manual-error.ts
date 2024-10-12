import { ValidationError } from '@nestjs/common';

export const formatManualError = (dtoErrors: ValidationError[]) => {
  return dtoErrors
    .map((error) => Object.values(error.constraints).flat())
    .flat();
};

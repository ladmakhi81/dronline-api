import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    return user;
  },
);

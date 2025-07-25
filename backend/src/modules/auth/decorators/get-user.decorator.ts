import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '@auth/schemas/auth-user.entity';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

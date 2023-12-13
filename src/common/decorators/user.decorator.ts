import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserData } from '../../users/schema/user.schema';

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

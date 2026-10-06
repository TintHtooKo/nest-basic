
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserData } from '../interfaces/user-data.interface';

export const User = createParamDecorator(
  (data: keyof UserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user:UserData = request.user;
    return data ? user[data] : user;
  },
);

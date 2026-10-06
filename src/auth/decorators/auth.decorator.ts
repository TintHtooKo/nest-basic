import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-type-enum';

export const Auth = (...args: AuthType[]) => SetMetadata('auth', args);

import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';

@Injectable()
export class AccessTokenGuard implements CanActivate {

  constructor(
    private readonly jwtService:JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration:ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // Get request from context
    const request = context.switchToHttp().getRequest();

    // Get token from request header
    const token = this.getTokenFromHeader(request);

    // Validate token
    if(!token){
        throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token,this.jwtConfiguration)
      request['user'] = payload
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private getTokenFromHeader(request:Request):string|undefined{
    const [_,token] = request.headers.authorization?.split(' ') ?? [];
    return token
  }
}

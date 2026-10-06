import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthType } from 'src/auth/enums/auth-type-enum';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>
  constructor(
    private readonly accessTokenGuard:AccessTokenGuard,
    private readonly reflector:Reflector
  ){
    this.authTypeGuardMap = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: {canActivate: () => true},
  }
  }
   
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      // "auth" is a key in the auth.decorator
      "auth",
      [context.getHandler(),context.getClass()]
    ) ?? [AuthenticationGuard.defaultAuthType]
    const guards = authTypes.map((type)=>this.authTypeGuardMap[type]).flat()

    let error = new UnauthorizedException()

    for(const instance of guards){
      const canActivate = await Promise.resolve(instance.canActivate(context))
            .catch(err=>{
                error = err
            })
      if(canActivate){
        return true
      }
      throw error
    }

    return true; 
  }
}

### Refresh Token
First of all create GenerateTokenProvider
```
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { User } from 'src/users/user.entity';

@Injectable()
export class GenerateTokenProvider {
    constructor(
        private readonly jwtService:JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig>,
    ){}

    async signToken<T>(userId:number,expiresIn:number,payload?:T){
        return await this.jwtService.signAsync({
            id:userId,
            ...payload
        },{
            secret:this.jwtConfiguration.secret,
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            expiresIn
        })
    }

    async generateTokens(user:User){
        const [accessToken,refreshToken] =await Promise.all([
            this.signToken(user.id, this.jwtConfiguration.accessTokenTtl,{email:user.email}),
            this.signToken(user.id,this.jwtConfiguration.refreshTokenTtl)
        ])
        return {accessToken,refreshToken}
    }
}
```
You can use this generateTokens in signIn. It will generate both accessToken and refreshToken

This is for RefreshTokenProvider
```
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { UserService } from 'src/users/providers/user.service';
import { GenerateTokenProvider } from './generate-token.provider';

@Injectable()
export class RefreshTokensProvider {
    constructor(
        private readonly jwtService:JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig>,

        @Inject(forwardRef(() => UserService))
        private readonly userService:UserService,

        private readonly generateTokenProvider:GenerateTokenProvider
    ){}

    async refreshTokens(refreshTokenDto:RefreshTokenDto){
        try {
            // verify token
            const {id} = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken,{
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
            })

            // get user from db
            const user = await this.userService.findUserById(id)

            // generate new token
            return await this.generateTokenProvider.generateTokens(user)
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }
}

```

And then you can use in service
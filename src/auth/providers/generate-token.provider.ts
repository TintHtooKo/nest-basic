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

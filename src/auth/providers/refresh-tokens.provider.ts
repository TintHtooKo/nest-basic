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

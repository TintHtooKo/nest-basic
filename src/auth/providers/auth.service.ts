import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/user.service';
import { SignInDto } from '../dtos/signin.dto';
import { SigninProviderTs } from './signin.provider.ts';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService:UserService,

        private readonly signinProvider:SigninProviderTs,

        private readonly refreshTokensProvider:RefreshTokensProvider
    ){}

    async signIn(signInDto:SignInDto){
        return await this.signinProvider.signIn(signInDto)
    }

    isAuth(){
        return true
    }

    async refreshToken(refreshTokenDto:RefreshTokenDto){
        return await this.refreshTokensProvider.refreshTokens(refreshTokenDto)
    }
}

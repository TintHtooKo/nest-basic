import { forwardRef, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { UserService } from 'src/users/providers/user.service';
import { GenerateTokenProvider } from '../providers/generate-token.provider';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
    private oauthClient: OAuth2Client

    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig>,

        @Inject(forwardRef(()=>UserService))
        private readonly userService:UserService,

        private readonly generateTokenProvider:GenerateTokenProvider
    ){}

    onModuleInit() {
        const clientId = this.jwtConfiguration.googleClientId
        const clientSecret = this.jwtConfiguration.googleClientSecret
        this.oauthClient = new OAuth2Client(clientId,clientSecret)
    }

    async authentication(googleTokenDto:GoogleTokenDto){
        try {
            // verify google token
            const googleTicket = await this.oauthClient.verifyIdToken({
                idToken:googleTokenDto.token
            })

            // extract payload from google ticket token
            const {email,sub:googleId,given_name:firstName, family_name:lastName} = googleTicket.getPayload()!

            // find user with google id
            const user = await this.userService.findByGoogleId(googleId)

            // if googleId is okay, generate token and done
            if(user){
                return this.generateTokenProvider.generateTokens(user)
            }

            // if googleId is not okay, create user with google and generate token
            const googleUser = await this.userService.createGoogleUser({
                email:email!,
                firstName:firstName!,
                lastName:lastName!,
                googleId
            })
            return this.generateTokenProvider.generateTokens(googleUser)
        } catch (error) {
            throw new UnauthorizedException(error)
        }
    }
}

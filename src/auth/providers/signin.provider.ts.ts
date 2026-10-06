import { forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { UserService } from 'src/users/providers/user.service';
import { SignInDto } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SigninProviderTs {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService:UserService,

        private readonly hashingProvider:HashingProvider,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig>,

        private readonly jwtService:JwtService
    ){}

    async signIn(signInDto:SignInDto){
        let user = await this.userService.findByEmail(signInDto.email)

        let isEqual: boolean = false
        try {
            isEqual = await this.hashingProvider.compare(signInDto.password,user.password)
        } catch (error) {
            throw new RequestTimeoutException('Cannot process your request this time.',{
                description:"Cannot connect to database"
            })
        }
        if(!isEqual){
            throw new RequestTimeoutException('Cannot process your request this time.',{
                description:"Incorrect password"
            })
        }

        const accessToken = await this.jwtService.signAsync({
            id:user.id,
            email:user.email
        },{
            secret:this.jwtConfiguration.secret,
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            expiresIn: this.jwtConfiguration.accessTokenTtl
        })
        
        return {accessToken}
    }

}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/user.service';
import { SignInDto } from '../dtos/signin.dto';
import { SigninProviderTs } from './signin.provider.ts';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService:UserService,

        private readonly signinProvider:SigninProviderTs
    ){}

    async signIn(signInDto:SignInDto){
        return await this.signinProvider.signIn(signInDto)
    }

    isAuth(){
        return true
    }
}

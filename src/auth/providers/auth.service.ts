import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/user.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService:UserService
    ){}

    login(id:string,email:string, password:string){
        const user = this.userService.findUserById(id)
        return 'Token'
    }

    isAuth(){
        return true
    }
}

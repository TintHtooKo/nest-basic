import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";

/** This class service connect to users */
@Injectable()
export class UserService{
    /** This is Constructor */
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService:AuthService
    ){}

    /** Get all users */
    getAllUser(limit:number,page:number){
        this.authService.isAuth()
        return [
            {
                id:1,
                name:"John Doe"
            },
            {
                id:2,
                name:"asdf efwe"
            },
            {
                id:3,
                name:"2wesdv sdfdv"
            },
            limit,
            page
        ]
    }

    /** Get user by id */
    findUserById(id:string) {
        console.log(id);
    }
}
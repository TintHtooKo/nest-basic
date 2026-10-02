import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create.user.dto";
import { ConfigService } from "@nestjs/config";

/** This class service connect to users */
@Injectable()
export class UserService{
    /** This is Constructor */
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService:AuthService,

        @InjectRepository(User)
        private userRepository:Repository<User>,

        private readonly configService:ConfigService
    ){}

    /** Get all users */
    getAllUser(limit:number,page:number){
        this.authService.isAuth()

        const env = this.configService.get("AUTH_KEY")

        console.log(env)

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

    async createUser(createUserDto:CreateUserDto){
        const existUser = await this.userRepository.findOne({
            where:{email:createUserDto.email}
        })
        let newUser = this.userRepository.create(createUserDto)
        newUser = await this.userRepository.save(newUser)
        return newUser
    }
}
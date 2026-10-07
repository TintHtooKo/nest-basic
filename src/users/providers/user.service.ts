import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create.user.dto";
import * as config from "@nestjs/config";
import authConfig from "../config/auth.config";
import { MultiUserCreateProvider } from "./multi-user-create.provider";
import { CreateMultiUserDto } from "../dtos/multi-create-users.dto";
import { CreateUserProvider } from "./create-user.provider";
import { FindByEmailProviderTs } from "./find-by-email.provider.ts";
import { FindByGoogleIdProvider } from "./find-by-google-id.provider";
import { CreateGoogleUserProvider } from "./create-google-user.provider";
import { GoogleUser } from "../interfaces/google-user.interface";

/** This class service connect to users */
@Injectable()
export class UserService{
    /** This is Constructor */
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService:AuthService,

        @InjectRepository(User)
        private userRepository:Repository<User>,

        private readonly configService:config.ConfigService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration:config.ConfigType<typeof authConfig>,

        private readonly multiUserCreateProvider:MultiUserCreateProvider,

        private readonly createUserProvider:CreateUserProvider,

        private readonly findByEmailProvider:FindByEmailProviderTs,

        private readonly findByGoogleIdProvider:FindByGoogleIdProvider,

        private readonly createGoogleUserProvider:CreateGoogleUserProvider
    ){}

    /** Get all users */
    getAllUser(limit:number,page:number){
        this.authService.isAuth()

        const env = this.configService.get("AUTH_KEY")

        console.log(env)
        console.log(this.authConfiguration.fallback)
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
    async findUserById(id:number) {
        let user
        try {
            user = await this.userRepository.findOneBy({id})
        } catch (error) {
            throw new RequestTimeoutException('Cannot process your request this time.',{
                description:"Cannot connect to database"
            })
        }
        if(!user){
            throw new BadRequestException("User not found")
        }
        return user
    }

    async createUser(createUserDto:CreateUserDto){
        return this.createUserProvider.createUser(createUserDto)
    }

    async createMulti(createMultiUserDto:CreateMultiUserDto){
        return this.multiUserCreateProvider.createMulti(createMultiUserDto)
    }

    async findByEmail(email:string){
        return await this.findByEmailProvider.findByEmail(email)
    }

    async findByGoogleId(googleId:string){
        return await this.findByGoogleIdProvider.findByGoogleId(googleId)
    }

    async createGoogleUser(googleUser:GoogleUser){
        return await this.createGoogleUserProvider.createGoogleUser(googleUser)
    }
}
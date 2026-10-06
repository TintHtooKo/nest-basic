import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindByEmailProviderTs {
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    async findByEmail(email:string){
        let user 
        try {
            user = await this.userRepository.findOneBy({email})
        } catch (error) {
            throw new RequestTimeoutException('Cannot process your request this time.',{
                description:"Cannot connect to database"
            })
        }
        if(!user){
            throw new UnauthorizedException("User not found")
        }
        return user
    }
}

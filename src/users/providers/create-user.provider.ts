import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider:HashingProvider
    ){}
    async createUser(createUserDto:CreateUserDto){
            let existUser
            try {
                existUser = await this.userRepository.findOne({
                    where:{email:createUserDto.email}
                })
            } catch (error) {
                throw new RequestTimeoutException('Cannot process your request this time.',{
                    description:"Cannot connect to database"
                })
            }
            if(existUser){
                throw new BadRequestException("User already exist")
            }
            let newUser = this.userRepository.create({
                ...createUserDto,
                password: await this.hashingProvider.hashPassword(createUserDto.password)
            })
            newUser = await this.userRepository.save(newUser)
            try {
                 newUser = await this.userRepository.save(newUser)
            } catch (error) {
                throw new RequestTimeoutException('Cannot process your request this time.',{
                    description:"Cannot connect to database"
                })
            }
            return newUser
        }
}

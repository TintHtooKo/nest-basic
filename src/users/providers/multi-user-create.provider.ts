import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateMultiUserDto } from '../dtos/multi-create-users.dto';

@Injectable()
export class MultiUserCreateProvider {
    constructor(
        private readonly dataSource:DataSource
    ){}

    async createMulti(createUsersDto:CreateMultiUserDto){
        const newUsers: User[] = []

        // Query runner instance
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            // Connect
            await queryRunner.connect();

            // Start transaction
            await queryRunner.startTransaction();
        } catch (error) {
            throw new RequestTimeoutException('Cannot process your request this time.',{
                description:"Cannot connect to database"
            })
        }

        try {
            for(let user of createUsersDto.users){
                let newUser = queryRunner.manager.create(User,user)
                let result = await queryRunner.manager.save(newUser)
                newUsers.push(result)
            }

            // If success, commit
            await queryRunner.commitTransaction();
        } catch (error) {
            // if failed, rollback
            await queryRunner.rollbackTransaction();
            throw new ConflictException("cannot complete request",{
                description:String(error)
            })
        }finally{
            // release
            await queryRunner.release();
        }
        return newUsers
    }
}

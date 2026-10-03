import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './providers/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { MultiUserCreateProvider } from './providers/multi-user-create.provider';
import authConfig from './config/auth.config';

@Module({
  controllers: [UsersController],
  providers:[UserService, MultiUserCreateProvider],
  exports:[UserService],
  imports:[
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(authConfig)
  ]
})
export class UsersModule {}

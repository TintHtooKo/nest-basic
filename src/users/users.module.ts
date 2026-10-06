import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './providers/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { MultiUserCreateProvider } from './providers/multi-user-create.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindByEmailProviderTs } from './providers/find-by-email.provider.ts';
import authConfig from './config/auth.config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers:[UserService, MultiUserCreateProvider, CreateUserProvider, FindByEmailProviderTs],
  exports:[UserService],
  imports:[
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider())
  ]
})
export class UsersModule {}

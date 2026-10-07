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
import { FindByGoogleIdProvider } from './providers/find-by-google-id.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';

@Module({
  controllers: [UsersController],
  providers:[UserService, MultiUserCreateProvider, CreateUserProvider, FindByEmailProviderTs, FindByGoogleIdProvider, CreateGoogleUserProvider],
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

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { MultiUserCreateProvider } from './multi-user-create.provider';
import { CreateUserProvider } from './create-user.provider';
import { FindByEmailProviderTs } from './find-by-email.provider.ts';
import { FindByGoogleIdProvider } from './find-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { CreateUserDto } from '../dtos/create.user.dto';

describe('UsersService', () => {
    let service: UserService;
    beforeEach(async () => {
        const mockCreateUserProvider: Partial<CreateUserProvider> = {
        createUser: (createUserDto: CreateUserDto) =>
            Promise.resolve({
            id: 1,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            password: createUserDto.password,
            } as User),
        };
        const module: TestingModule = await Test.createTestingModule({
        providers: [UserService,
            {provide: DataSource, useValue:{}},
            {provide: getRepositoryToken(User),useValue:{}},
            {provide: MultiUserCreateProvider,useValue:{}},
            {provide: CreateUserProvider,useValue:{}},
            {provide: FindByEmailProviderTs,useValue:{}},
            {provide: FindByGoogleIdProvider,useValue:{}},
            {provide: CreateGoogleUserProvider,useValue:{}}
            
        ],
        }).compile();

        service =module.get<UserService>(UserService);

    });

     it('Controller should be defined', () => {
    expect(service).toBeDefined();
    });
    it('should call createUser in CreateUserProvider', async () => {
        const user = await service.createUser({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: 'password',
        });
        expect(user.firstName).toEqual('John');
        expect(user.lastName).toEqual('Doe');
        expect(user.email).toEqual('john@doe.com');
    });
});

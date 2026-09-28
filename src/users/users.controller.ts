import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create.user.dto';
import { GetUserDto } from './dtos/get.user.dto';
import { PatchUserDto } from './dtos/patch.user.dto';
import { UserService } from './providers/user.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private readonly userService:UserService){}
    @Get()
    @ApiOperation({summary:"Get all users"})
    @ApiResponse({status:200,description:"Get all users status code"})
    @ApiQuery({
        name:"limit",
        type:"number",
        required:false,
        description:"limit",
        example:10
    })
    @ApiQuery({
        name:"page",
        type:"number",
        required:false,
        description:"page",
        example:5
    })
    getUsers(
        @Query('limit',new DefaultValuePipe(10),ParseIntPipe) limit:number,
        @Query('page',new DefaultValuePipe(5),ParseIntPipe) page:number
    ) {
        return this.userService.getAllUser(limit,page);    
    }

    @Get(":id")
    detailUser(@Param() getUserDto:GetUserDto){
        console.log(getUserDto);
        return "detail user endpoint";
    }


    @Post()
    createUser(@Body() createUserDto:CreateUserDto){ 
        console.log(createUserDto);
        return "create user endpoint";
    }

    @Patch()
    updateUser(@Body() patchUserDto:PatchUserDto){
        console.log(patchUserDto);
        return "update user endpoint";
    }

}

import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type-enum';
import { GoogleAuthService } from './google-auth.service';
import { GoogleTokenDto } from './dtos/google-token.dto';

@Auth(AuthType.None)
@Controller('auth/google-auth')
export class GoogleAuthController {
    constructor(
        private readonly googleAuthService:GoogleAuthService
    ){}

    @Post()
    authenticate(@Body() googleTokenDto:GoogleTokenDto){
        return this.googleAuthService.authentication(googleTokenDto)
    }
}

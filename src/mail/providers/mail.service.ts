import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService:MailerService
    ){}

    async sendMail(user:User){
        await this.mailerService.sendMail({
            to:user.email,
            from:"example@example.com",
            subject:"This is testing mail service",
            template:'./welcome',
            context:{
                name:user.firstName,
                email:user.email
            },
        })
    }
}

### Mail service
```
npm i @nestjs-modules/mailer
```
```
npm i ejs
```
```
npm i nodemailer
```
And then create module, template and service
In mail.module.ts
```
import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter.js';

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async(config: ConfigService)=>({
        transport:{
          host: config.get("appConfig.mailHost"),
          secure: false,
          port: 2525,
          auth:{
            user:config.get("appConfig.smtpUsername"),
            pass:config.get("appConfig.smtpPassword")
          }
        },
        defaults: {
          from: 'no-reple'
        },
        template:{
          dir: join(__dirname,'templates'),
          adapter: new EjsAdapter({
            inlineCssEnabled:true
          })
        }
      })
    })
  ]
})
export class MailModule {}

```
@Global(): ဒီ Module ကို Global အဖြစ် သတ်မှတ်ပေးတာပါ။ ဒါကြောင့် တခြား Module တွေမှာ MailModule ကို ထပ်ခါထပ်ခါ imports လုပ်စရာမလိုဘဲ အီးမေးလ် Service ကို တိုက်ရိုက် ခေါ်သုံးလို့ရသွားပါလိမ့်မယ်။

exports: [MailService]: တခြား Module တွေကပါ MailService ကို ယူသုံးနိုင်အောင် အပြင်သို့ ထုတ်ပေး (Export) လိုက်တာပါ။

inject:[ConfigService]: အပလီကေးရှင်းရဲ့ Environment Variables (.env file) ထဲက Email Host, Username, Password စတာတွေကို ဘေးကင်းစွာ ဆွဲယူဖို့ သုံးထားတာဖြစ်ပါတယ်။

In mail.service.ts
```
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
```
private readonly mailerService:MailerService

@nestjs-modules/mailer ထဲက MailerService ကို inject လုပ်
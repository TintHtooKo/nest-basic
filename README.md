### Hashing Password
First of all, you have to create two providers for hashing password.
The first one is abstract class.
ဒါက "စာချုပ်" (Contract) သို့မဟုတ် "သတ်မှတ်ချက်" ဖြစ်ပါတယ်။
သူ့ရဲ့ အလုပ်: Password ကို Hash လုပ်ဖို့နဲ့ Compare လုပ်ဖို့အတွက် Method တွေ ရှိရမယ်လို့ လမ်းညွှန်ချက် ပေးထားတာပါ။

The second one is Concrete Implementation.
ဒါက "လက်တွေ့ အလုပ်လုပ်တဲ့ ကုတ်" (Implementation) ဖြစ်ပါတယ်။

ဘာကြောင့် ဒီလို ၂ ခု ခွဲရေးရတာလဲ။ (အဓိက အကျိုးကျေးဇူးများ)
၁။ နည်းပညာ ပြောင်းလဲရလွယ်ကူခြင်း (Flexibility)
ဥပမာ - နောင်တစ်ချိန်မှာ bcrypt က လုံခြုံရေး အားနည်းသွားလို့ သို့မဟုတ် ကုမ္ပဏီ Requirement အရ argon2 သို့မဟုတ် scrypt ဘက်ကို ပြောင်းချင်တယ် ဆိုပါစို့။

ခွဲမရေးထားရင်: bcrypt ကို နေရာအနှံ့ ခေါ်သုံးထားရင် သုံးထားတဲ့ AuthService, UserService စတဲ့ File တိုင်းမှာ လိုက်ပြင်နေရပါလိမ့်မယ်။

ခွဲရေးထားရင်: Argon2Provider ဆိုတဲ့ Class သစ်တစ်ခုပဲ ထပ်ရေးလိုက်ပြီး NestJS Module ရဲ့ Provider မှာ ပြောင်းပေးလိုက်ရုံနဲ့ အကုန်အဆင်ပြေသွားပါပြီ။ AuthService ရဲ့ ကုတ်ကို နည်းနည်းမှ ပြင်စရာမလိုပါဘူး။

This is hashing.provider.ts
```
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
    abstract hashPassword(data: string): Promise<string>;
    abstract compare(data: string, hashPw: string): Promise<boolean>;
}
```

This is bcrypt.provider.ts
```
import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
    async hashPassword(data: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(data, salt);
    }

    compare(data: string, hashPw: string): Promise<boolean> {
        return bcrypt.compare(data, hashPw);
    }
}

```

And then import and export in module.

```
import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, {
    provide: HashingProvider,
    useClass: BcryptProvider
  }],
  imports: [forwardRef(() => UsersModule)],
  exports: [AuthService,HashingProvider],
})
export class AuthModule {}

```

```
// NestJS Module မှာ နည်းပညာ ပြောင်းချင်ရင် Provider တစ်ကြောင်းပဲ ပြောင်းရုံပါပဲ
{
  provide: HashingProvider,
  useClass: Argon2Provider, // BcryptProvider အစား Argon2Provider သို့ လွယ်ကူစွာ ပြောင်းနိုင်သည်
}
```

And then update in createUser from service like this.
```
constructor(
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider:HashingProvider
){}

<!-- ---------------------------------- -->

let newUser = this.userRepository.create({
                ...createUserDto,
                password: await this.hashingProvider.hashPassword(createUserDto.password)
                })
```

### JWT token
```
npm i @nestjs/jwt
```

And then setup in .env
```
JWT_SECRET=Your secret key
JWT_TOKEN_AUDIENCE=http://localhost:3000   
JWT_TOKEN_ISSUER=http://localhost:3000
JWT_ACCESS_TOKEN_TTL=3600
```
You can generate secret key with this command
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

And then make config file
auth/config/jwt.config.ts
```
import { registerAs } from "@nestjs/config";

export default registerAs('jwt',()=>{
    return {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600',10)
    }
})
```

And then import in module what you want to use.
```
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider())
  ],
})
export class AuthModule {}

```
#### ConfigModule.forFeature(jwtConfig) ကို ဘာကြောင့် Import လုပ်တာလဲ?
🎯 အဓိက တာဝန် - JWT Config ကို သီးသန့် Load လုပ်ရန်
NestJS ရဲ့ ConfigModule မှာ .env ထဲက တန်ဖိုးတွေကို ယူသုံးတဲ့အခါ Global Config အပြင် သက်ဆိုင်ရာ Module အလိုက် Configuration များကို သီးသန့်ခွဲထုတ်ပြီး register လုပ်တာကို Custom / Namespace Configuration လို့ ခေါ်ပါတယ်။
jwtConfig ဆိုတာ ဘာလဲ: .env ထဲက JWT_SECRET, JWT_TOKEN_TTL (Token သက်တမ်း) စတဲ့ အချက်အလက်တွေကို JSON Object အဖြစ် စနစ်တကျ စုထားတဲ့ file ဖြစ်ပါတယ်။
forFeature(jwtConfig) ရဲ့ အလုပ်: ဒီ AuthModule ထဲမှာပဲ jwtConfig ရဲ့ တန်ဖိုးတွေကို ခေါ်သုံးလို့ရအောင် register လုပ်ပေးလိုက်တာပါ။

#### JwtModule.registerAsync(jwtConfig.asProvider()) ကို ဘာကြောင့် Import လုပ်တာလဲ
🎯 အဓိက တာဝန် - JWT Service ကို အသုံးပြုခွင့်ရရန်နှင့် .env တန်ဖိုးများကို Dynamic ချိတ်ဆက်ရန်
NestJS ရဲ့ @nestjs/jwt package ကနေ JwtService (Token ထုတ်ပေးခြင်း/စစ်ဆေးခြင်း ပြုလုပ်ပေးသည့် Service) ကို AuthService ထဲမှာ Injection ဝှက်ပြီး ခေါ်သုံးနိုင်ဖို့အတွက် JwtModule ကို Import လုပ်ပေးရပါတယ်။

#### ဘာကြောင့် registerAsync() ကို သုံးတာလဲ
သာမန် JwtModule.register({ secret: 'mysecret' }) လို့ ရေးရင် App စတင်ပွင့်ချိန်မှာ .env ထဲက တန်ဖိုးတွေ Load မလုပ်ရသေးတဲ့အတွက် secret key က undefined ဖြစ်သွားတတ်ပါတယ်။
registerAsync() ကို သုံးလိုက်ရင် .env ထဲက Config တန်ဖိုးတွေ ဖတ်ပြီးမှ သေချာ Dynamic Load လုပ်ပေးတာ ကြောင့် ဘေးကင်းပါတယ်။

#### ဘာကြောင့် jwtConfig.asProvider() ကို သုံးတာလဲ
NestJS 10+ ရဲ့ အသစ်ပါလာတဲ့ နည်းလမ်းဖြစ်ပါတယ်။
.env ထဲက JWT Settings တွေကို JwtModule ထံသို့ အလွယ်တကူ Direct Binding (ချိတ်ဆက်) ပေးလိုက်တာပါ။
ဒါကြောင့် secret, signOptions စတာတွေကို လိုက်ရေးနေစရာမလိုဘဲ jwtConfig ထဲက Configuration အားလုံးကို JwtModule က အလိုအလျောက် ယူသုံးသွားပါတယ်။



And then inject in provider and use
```
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SigninProviderTs {
    constructor(
        <!-- ဒီမှာ တခြား code တွေ ရှိမယ် -->

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig>,

        private readonly jwtService:JwtService
    ){}

    async signIn(signInDto:SignInDto){
        <!-- ဒီမှာ တခြား code တွေ ရှိမယ် -->

        const accessToken = await this.jwtService.signAsync({
            id:user.id,
            email:user.email
        },{
            secret:this.jwtConfiguration.secret,
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            expiresIn: this.jwtConfiguration.accessTokenTtl
        })
        
        return {accessToken}
    }

}

```

### Guard
```
nest g guard file_path --no-spec
```
NestJS မှာ Guard ဆိုတာ Application ဆီကို လာတဲ့ Request တစ်ခုဟာ သက်ဆိုင်ရာ Route (API Endpoint) ထံ သွားခွင့် ရှိ မရှိ စစ်ဆေးပေးတဲ့ လုံခြုံရေး အစောင့် (Security Gatekeeper) ဖြစ်ပါတယ်။ ခွင့်ပြုချက် (Permission/Role) ရှိသူမှသာ API ကို အသုံးပြုခွင့် ပေးချင်တဲ့အခါ အဓိက သုံးပါတယ်။   
Eg. Authentication with token
```
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';

@Injectable()
export class AccessTokenGuard implements CanActivate {

  constructor(
    private readonly jwtService:JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration:ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // Get request from context
    const request = context.switchToHttp().getRequest();

    // Get token from request header
    const token = this.getTokenFromHeader(request);

    // Validate token
    if(!token){
        throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token,this.jwtConfiguration)
      console.log(payload)
      request['user'] = payload
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private getTokenFromHeader(request:Request):string|undefined{
    const [_,token] = request.headers.authorization?.split(' ') ?? [];
    return token
  }
}
```
#### Explination of this part (const [_,token] = request.headers.authorization?.split(' ') ?? [];)
ဘာကြောင့် split(' ') ကို သုံးတာလဲ
Client (Frontend) ဘက်ကနေ API ကို Token ပို့ပေးတဲ့အခါ Standard HTTP Header Format အနေနဲ့ အောက်ပါအတိုင်း ပို့လေ့ရှိပါတယ်
Eg
``` 
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
``` 
ဒီနေရာမှာ -
1-Bearer ဆိုတဲ့ စာသား
2-(Space - ကွက်လပ်)
3-eyJhbGci... ဆိုတဲ့ အမှန်တကယ် လိုအပ်သော Token စာသား
ဆိုပြီး အပိုင်း ၃ ပိုင်း ပါဝင်နေပါတယ်။

request.headers.authorization?.split(' ') လို့ ရေးလိုက်တဲ့အခါ Space ( ) ကို အခြေခံပြီး Array ၂ ပိုင်း ခွဲထုတ်လိုက်ပါတယ် -
index 0 မှာ Bearer ရောက်သွားမည်။
index 1 မှာ eyJhbGci... (Token) ရောက်သွားမည်။

##### Array Destructuring [_, token] အလုပ်လုပ်ပုံ
Code ထဲက const [_, token] ဆိုတာ ES6 Array Destructuring နည်းလမ်းဖြစ်ပါတယ်။
_ (Underscore) ဆိုတာ index 0 က Bearer ဆိုတဲ့ စာသားကို ခေတ္တယူထားတာ ဖြစ်ပြီး "ငါတို့ ဒီတန်ဖိုးကို မသုံးချင်ဘူး/ဂရုမစိုက်ဘူး" လို့ ကွန်ပျူတာကို အသိပေးလိုက်တာပါ။
token ဆိုတဲ့ variable ထဲမှာတော့ index 1 မှာရှိတဲ့ အမှန်တကယ် လိုအပ်သော Token စာသား ရောက်ရှိသွားပါတယ်။


### @Auth() Decorator
@Auth() Decorator: Controller သို့မဟုတ် Route Method များပေါ်တွင် မည်သည့် Authentication အမျိုးအစား (ဥပမာ- Bearer, None, ApiKey) သုံးမည်ကို သတ်မှတ်ပေးသည့် custom decorator ဖြစ်သည်။
```
import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-type-enum';

export const Auth = (...args: AuthType[]) => SetMetadata('auth', args);
```
ကိုယ်သုံးချင်တဲ့ controller မှာ @Auth(AuthType.Bearer) သို့မဟုတ် @Auth(AuthType.None) ဟု ရေးလိုက်ပါက NestJS ၏ Metadata စနစ်ထဲတွင် 'auth' ဆိုသည့် key ဖြင့် AuthType Array ကို သိမ်းဆည်းပေးသည်။

### authentication.guard.ts
``` 
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthType } from 'src/auth/enums/auth-type-enum';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>
  constructor(
    private readonly accessTokenGuard:AccessTokenGuard,
    private readonly reflector:Reflector
  ){
    this.authTypeGuardMap = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: {canActivate: () => true},
  }
  }
   
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      // "auth" is a key in the auth.decorator
      "auth",
      [context.getHandler(),context.getClass()]
    ) ?? [AuthenticationGuard.defaultAuthType]
    const guards = authTypes.map((type)=>this.authTypeGuardMap[type]).flat()

    let error = new UnauthorizedException()

    for(const instance of guards){
      const canActivate = await Promise.resolve(instance.canActivate(context))
            .catch(err=>{
                error = err
            })
      if(canActivate){
        return true
      }
      throw error
    }

    return true; 
  }
}
``` 
AuthenticationGuard: Request ဝင်လာသည့်အခါ Decorator က သတ်မှတ်ထားသော AuthType များကို စစ်ဆေးပြီး သက်ဆိုင်ရာ Guard(များ) ကို dynamic အားဖြင့် ချိတ်ဆက်စစ်ဆေးပေးသည့် Guard ဖြစ်သည်။
``` 
private static readonly defaultAuthType = AuthType.Bearer;
``` 
Route ပေါ်တွင် Decorator တင်မထားပါက Default အနေဖြင့် Bearer token စစ်ဆေးမည်။

``` 
constructor(
    private readonly accessTokenGuard:AccessTokenGuard,
    private readonly reflector:Reflector
  ){
    this.authTypeGuardMap = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: {canActivate: () => true},
  }
  }
```
AuthType.Bearer ဆိုပါက AccessTokenGuard ကို သုံးမည်။
AuthType.None (Public Endpoint) ဆိုပါက အမြဲ true ပြန်ပေးသည့် အလွယ် Guard တစ်ခုကို သုံးမည်။

#### Reflector ဖြင့် Metadata ရယူခြင်း
``` 
const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
  "auth",
  [context.getHandler(), context.getClass()]
) ?? [AuthenticationGuard.defaultAuthType];
``` 
Method (Handler)(Top of the controller) ပေါ်တွင် သတ်မှတ်ထားသော @Auth() decorator ၏ metadata ကို အရင်ကြည့်သည်။
မရှိပါက Class (Controller) ပေါ်က metadata ကို ကြည့်သည်။
နှစ်ခုလုံးတွင် မရှိပါက Nullish coalescing (??) အကူအညီဖြင့် Default ဖြစ်သော [AuthType.Bearer] ကို အသုံးပြုသည်။

#### Guards Dynamic List ပြုလုပ်ခြင်း
``` 
const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
```
ရရှိလာသော authTypes array ကို map လုပ်ပြီး authTypeGuardMap ထဲမှ သက်ဆိုင်ရာ Guard instance များကို ယူသည်။ .flat() သုံးထားသောကြောင့် CanActivate[] (Multiple Guards) ရောက်လာပါကလည်း Array တစ်ခုတည်းဖြစ်အောင် Flatten လုပ်ပေးသည်။

#### Fallback & Loop Execution Logic
```
let error = new UnauthorizedException();

for (const instance of guards) {
  const canActivate = await Promise.resolve(instance.canActivate(context))
    .catch((err) => {
      error = err;
    });

  if (canActivate) {
    return true;
  }
  throw error;
}

return true;
```
Guard တစ်ခုချင်းစီ၏ canActivate(context) ကို ပတ်စစ်သည်။
Promise.resolve(...): canActivate သည် boolean, Promise<boolean>, သို့မဟုတ် Observable<boolean> ပြန်ပေးနိုင်သဖြင့် Sync/Async သေချာစေရန် Promise.resolve ဖြင့် ပတ်ထားခြင်းဖြစ်သည်။
catch handling: Guard က Error (ဥပမာ- Expired JWT) တက်ပါက သတ်မှတ်ထားသော error variable ထဲ သိမ်းလိုက်သည်။
Guard တစ်ခုခုက true ပြန်ပေးပါက ရလဒ်ကို true ဟု သတ်မှတ်ပြီး ရပ်လိုက်သည်။
အကယ်၍ Guard စစ်ဆေးမှု မအောင်မြင်ပါက (false သို့မဟုတ် Exception) သက်ဆိုင်ရာ error ကို throw လုပ်လိုက်သည်။

#### Importand Note
don't forget to add in app.module.ts
```
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';

@Module({
  providers: [
    AppService,
    {
      provide:APP_GUARD,
      useClass: AuthenticationGuard
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}

```



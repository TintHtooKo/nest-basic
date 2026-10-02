### @nestjs/config
```
npm i --save @nestjs/config
```
.env file ထဲက environment variables ကို NestJS application တစ်ခုလုံးမှာ လွယ်ကူ စနစ်တကျ ပြန်လည်ထုတ်သုံးနိုင်အောင် ပြုလုပ်ပေးတဲ့ package ဖြစ်ပါတယ်။

After install package, you have to create .env file in root folder.
And then import in app.module.ts
```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, }),],
})
```

And then, အခြား File / Service များထဲတွင် ConfigService ကို ခေါ်ယူအသုံးပြုပါ

```
import { ConfigService } from "@nestjs/config";
@Injectable()
export class UserService{
    constructor(
        private readonly configService:ConfigService
    ){}

    getAllUser(){
        const env = this.configService.get("AUTH_KEY")
        console.log(env)
    }
}
```

For real world project, there will be multiple .env file.
Eg. .env.local, .env.development etc
So how to do? 
first of all, you have to setup .evn you want to run in package.json like that.
```
"start:dev": "cross-env NODE_ENV=development nest start --watch",
```
Why use cross-evn?
If your system is Linux or macOS (Bash), no need cross-env.
If your system is window, you have to install and use cross-env
```
npm i -D cross-env
```

And then setup in app.module.ts
```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env.NODE_ENV

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal:true,
        envFilePath: ENV ? `.env.${ENV}` : '.env'
    })
  ],
})
```
That is .env setup.

### Use .env variable in app.module.ts
```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env.NODE_ENV

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService:ConfigService)=>({
        type: 'postgres',
        synchronize: true,
        port : +configService.get("DATABASE_PORT"),
        username: configService.get("DATABASE_USERNAME"),
        password: configService.get("DATABASE_PASSWORD"),
        host: configService.get("DATABASE_HOST"),
        database: configService.get("DATABASE_NAME"),
      })
    }), 
    ConfigModule.forRoot({
        isGlobal:true,
        envFilePath: ENV ? `.env.${ENV}` : '.env'
    })
  ],
})
```

port : +configService.get("DATABASE_PORT"), in there Why use +?
config always return string. but port should be number. That's why add plus to change number.

### Important note
When you changed forRootAsync, there should be imports and inject.
imports is for module and inject is for service. That's for every files

### Or Else
you can build global config src/config folder and can do like that
src/config/database.config.ts
```
import { registerAs } from "@nestjs/config";

export default registerAs('database',() => ({
    autoLoadEntities: process.env.DATABASE_AUTOLOAD === "true" ? true : false,
    synchronize: process.env.DATABASE_SYNC === "true" ? true : false,
    port : parseInt(process.env.DATABASE_PORT!) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
}))
```

app.module.ts
```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
const ENV = process.env.NODE_ENV

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService:ConfigService)=>({
        type: 'postgres',
        autoLoadEntities:true,
        synchronize: true,
        port : +configService.get("database.port"),
        username: configService.get("database.username"),
        password: configService.get("database.password"),
        host: configService.get("database.host"),
        database: configService.get("database.name"),
      })
    }), 
    ConfigModule.forRoot({
        isGlobal:true,
        envFilePath: ENV ? `.env.${ENV}` : '.env',
        load: [databaseConfig]
    })
  ],
})
```

And also you can build config folder in related file
eg. src/user/config/auth.config.ts
```
import { registerAs } from "@nestjs/config";

export default registerAs('authConfig',()=>({
    fallback: process.env.AUTH_FALLBACK
}))
```

If you create config for user, you have to import in users.module.ts
eg.
```
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';
@Module({
  imports:[
    ConfigModule.forFeature(authConfig)
  ]
})
```
And then inject in users.service.ts and can use in there
```
@Injectable()
export class UserService{
    constructor(
        @Inject(authConfig.KEY)
        private readonly authConfiguration:config.ConfigType<typeof authConfig>
    ){}

    getAllUser(){
        console.log(this.authConfiguration.fallback)
    }
}
```

### .env validation
```
npm i joi
```
After install joi, create env.validation.ts file in global config folder
```
import Joi from 'joi';

export default Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    AUTH_KEY: Joi.string().required(),
    DATABASE_PORT: Joi.number().port().default(5432),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),

    DATABASE_AUTOLOAD: Joi.boolean().optional(),
    DATABASE_SYNC: Joi.boolean().optional(),

    AUTH_FALLBACK: Joi.string().required(),
})

```

And import in app.module.ts inside of config

```
ConfigModule.forRoot({
    validationSchema: envValidation
  })
```




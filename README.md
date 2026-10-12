## Important Note when deploy on VPS
Local project မှာဆိုရင် database က auto migrate ဖြစ်တယ်
But vps မှာ deploy လုပ်မယ်ဆိုရင် migration ကို manually လုပ်ပေးဖို့လိုတယ်

So let's create typeorm-cli.config.ts file
```
import { DataSource } from "typeorm";

export default new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "your-database-password",
    database: "your-database-name",
    entities: ["**/*.entity.js"],
    migrations: ["migrations/*.js"],
})
```
What is this for?
ဒီ typeorm-cli.config.ts file က NestJS project မှာ TypeORM CLI ကိုသုံးပြီး PostgreSQL database နဲ့ချိတ်ဆက်ဖို့၊ migration တွေကို run လုပ်ဖို့ သတ်မှတ်ထားတဲ့ configuration file ဖြစ်ပါတယ်။
ဥပမာ migration:generate, migration:run, migration:revert စတဲ့ command တွေသုံးတဲ့အခါ TypeORM CLI က ဒီ configuration ကို ဖတ်ပြီး database ကို ဘယ်လိုချိတ်ဆက်ရမလဲဆိုတာ သိနိုင်ပါတယ်။

And then create migrations folder inside src.
And then you can generate migrations with this command
```
npx typeorm migration:generate src/migrations/NameWhatYouWant -d dist/typeorm-cli.config
```

-d => datasource
dist/typeorm-cli.config => DataSource configuration file ရှိတဲ့နေရာ

typeorm-cli.config.ts file ဆောက်ပီး project ကို start ရင် dist folder auto generate ပီး အဲ့ထဲမှာ typeorm-cli.config file ရှိနေမယ်

After generate, run 
```
npx typeorm migration:run -d dist/typeorm-cli.config
```

### Import Note for .env
DATABASE_SYNC=false
You have to change DATABASE_SYNC to false.

And in production mode, before start, you have to npm run build first.
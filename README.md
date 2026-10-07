### Interceptor
NestJS မှာ Interceptor ဆိုတာ Controller ကနေ Request မจัดการမှီ (Request မရောက်ခင်) သို့မဟုတ် Response ပြန်မထွက်မီ (Response မရောက်ခင်) ကြားကနေ Request / Response တွေကို ကြားဖြတ်စစ်ဆေးခြင်း၊ ပြုပြင်ပြောင်းလဲခြင်း (Intercept & Transform) လုပ်ပေးတဲ့ Class တစ်ခုဖြစ်ပါတယ်။
Eg. I want to show api version in every response.
So i add API_VERSION in .env.development

and then also setup in database.config.ts

and then create interceptor
```
nest g interceptor common/interceptors/data-resource --no-spec
```

```
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class DataResourceInterceptor implements NestInterceptor {
  constructor(
  private readonly configService:ConfigService  
  ){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data)=>({
      apiVersion: this.configService.get("database.apiVersion"),
      data
    })));
  }
}
```


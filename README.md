### Upload file to aws
```
npm i @aws-sdk/client-s3
```
```
npm i -D @types/multer
```
And create S3 Bucket and AWS Cloudfront
AWS CloudFront ဆိုတာ Amazon Web Services (AWS) က ပံ့ပိုးပေးထားတဲ့ Content Delivery Network (CDN) ဝန်ဆောင်မှုတစ်ခု ဖြစ်ပါတယ်။
အလွယ်ဆုံး ပြောရရင် မိမိရဲ့ Website သို့မဟုတ် Application ထဲမှာပါတဲ့ ဖိုင်များ (ပုံများ၊ ဗီဒီယိုများ၊ CSS/JS ဖိုင်များ) ကို ကမ္ဘာတစ်ဝှမ်းမှာရှိတဲ့ User တွေဆီ အမြန်ဆုံးနဲ့ လုံခြုံစွာ ရောက်ရှိအောင် ပို့ဆောင်ပေးတဲ့ စနစ် ဖြစ်ပါတယ်။

And create module, service, provider, app config(for upload) and controller
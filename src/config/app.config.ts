import { registerAs } from "@nestjs/config";

export default registerAs('appConfig',() => ({
    awsBucketName: process.env.AWS_BUCKET_NAME,
    awsCloudfrontUrl: process.env.AWS_CLOUDFRONT_URL,
    awsRegion: process.env.AWS_REGION,
    awsS3AccessKey: process.env.AWS_S3_ACCESS_KEY,
    awsS3SecretKey: process.env.AWS_S3_SECRET_KEY
}))
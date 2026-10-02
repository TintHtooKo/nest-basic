import { registerAs } from "@nestjs/config";

export default registerAs('authConfig',()=>({
    fallback: process.env.AUTH_FALLBACK
}))
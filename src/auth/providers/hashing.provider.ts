import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
    abstract hashPassword(data: string): Promise<string>;
    abstract compare(data: string, hashPw: string): Promise<boolean>;
}

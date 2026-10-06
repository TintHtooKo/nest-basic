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

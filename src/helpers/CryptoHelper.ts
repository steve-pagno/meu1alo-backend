import { createHash } from 'crypto';

export default class CryptoHelper {
    public static encrypt(value: string): string {
        return createHash('sha256').update(value).digest('hex');
    }

    public static verify(valueNoEncrypted: string, valueEncrypted: string): boolean {
        return this.encrypt(valueNoEncrypted) === valueEncrypted;
    }
}

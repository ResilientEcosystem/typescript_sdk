import { CryptoKeypair } from '../utils/types/Crypto/index';
interface CryptoInterface {
    generateKeypair(): CryptoKeypair;
    hashData(data: string): string;
}
declare const Crypto: CryptoInterface;
export { Crypto, CryptoInterface };

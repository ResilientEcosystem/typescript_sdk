import { CryptoKeypair } from '../utils/types/Crypto/index';
declare class Crypto {
    static generateKeypair(): CryptoKeypair;
    static hashData(data: string): string;
    private static decodeKey;
    private static encodeData;
}
export default Crypto;

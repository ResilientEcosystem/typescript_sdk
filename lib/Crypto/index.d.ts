type CryptoKeypair = {
    publicKey: string;
    privateKey: string;
};
interface CryptoInterface {
    generateKeypair(): CryptoKeypair;
    hashData(data: string): string;
}
declare const Crypto: CryptoInterface;
export { Crypto, CryptoInterface, CryptoKeypair };

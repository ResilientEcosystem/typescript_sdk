import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';

import { CryptoKeypair } from '../utils/types/Crypto/index';

interface CryptoInterface {
    generateKeypair(): CryptoKeypair;
    hashData(data: string): string;
}

const Crypto: CryptoInterface = class {
    static generateKeypair(): CryptoKeypair {
        const keypair = crypto.generateKeyPairSync('ed25519', {
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });
        return {
            publicKey: this.decodeKey(keypair.publicKey),
            privateKey: this.decodeKey(keypair.privateKey),
        };
    }

    static hashData(data: string): string {
        return CryptoJS.SHA3(this.encodeData(data)).toString(CryptoJS.enc.Hex);
    }

    private static decodeKey(key: string): string {
        return Buffer.from(key, 'base64').toString('hex');
    }

    private static encodeData(data: string): string {
        return Buffer.from(data, 'utf-8').toString();
    }
};

export { Crypto, CryptoInterface };

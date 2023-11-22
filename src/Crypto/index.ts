/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as crypto from 'crypto';

import type { CryptoInterface, CryptoKeypair } from './interface';

export const Crypto: CryptoInterface = class {
    /**
     * Static function to generate a public and private key pair using ed25519 algorithm
     * @returns {CryptoKeypair} Dictionary with `publicKey` and `privateKey`
     */
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

    /**
     * Hashed string using SHA3-256 algorithm and converts hashed data to HEX
     * @param {string} data String data to be hashed
     * @returns {string} Returns HEX string of hashed data
     */
    static hashData(data: string): string {
        return crypto
            .createHash('SHA3-256')
            .update(this.encodeData(data))
            .digest('hex');
    }

    /**
     * Converts base64 key to hex
     * @param {string} key Base-64 key
     * @returns {string} Returns string of decoded hex characters
     */
    private static decodeKey(key: string): string {
        return Buffer.from(key, 'base64').toString('hex');
    }

    /**
     * Encodes utf-8 string into string
     * @param {string} data UTF-8 string
     * @returns {string} Returns string
     */
    private static encodeData(data: string): string {
        return Buffer.from(data, 'utf-8').toString();
    }
};

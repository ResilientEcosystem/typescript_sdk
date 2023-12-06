"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
const crypto = __importStar(require("crypto"));
const Crypto = class {
    /**
     * Static function to generate a public and private key pair using ed25519 algorithm
     * @returns {CryptoKeypair} Dictionary with `publicKey` and `privateKey`
     */
    static generateKeypair() {
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
    static hashData(data) {
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
    static decodeKey(key) {
        return Buffer.from(key, 'base64').toString('hex');
    }
    /**
     * Encodes utf-8 string into string
     * @param {string} data UTF-8 string
     * @returns {string} Returns string
     */
    static encodeData(data) {
        return Buffer.from(data, 'utf-8').toString();
    }
};
exports.Crypto = Crypto;

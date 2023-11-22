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

import {
    Ed25519Sha256Json,
    PrefixSha256Json,
    PreimageSha256Json,
    RsaSha256Json,
    ThresholdSha256Json,
} from 'crypto-conditions/types/types';
import type { TransactionLink, Input, Output } from './index';
import type { Fulfillment } from 'crypto-conditions';
import { ConditionAsn1Json } from 'crypto-conditions/types/lib/condition';

/**
 * @interface UnspentOutput
 * @member {string} transaction_id
 * @member {number} output_index
 * @member {number} amount
 * @member {string} asset_id
 * @member {string} condition_uri
 */
export interface UnspentOutput {
    transaction_id: string;
    output_index: number;
    amount: number;
    asset_id: string;
    condition_uri: string;
}

/**
 * @interface TransactionInterface
 * @method toDict
 * @method isEqual
 */
export interface TransactionInterface extends Object {
    toDict(): Record<string, any> | undefined;
    isEqual(other: TransactionInterface): boolean;
}

/**
 * @interface TransactionConstructor
 * @constructor
 * @static
 * @method fromDict - Static
 */
interface TransactionConstructor {
    fromDict(obj: Record<string, any>): TransactionInterface;
    new (...args: any): TransactionInterface;
}

/**
 * @interface TransactionInterface
 * Ambient Declaration. Links the static with the non-static
 */
export declare var TransactionInterface: TransactionConstructor;

/**
 * @interface InputConstructorConfig
 * @member {TransactionLink} fulfills - Optional
 */
export interface InputConstructorConfig {
    fulfills?: TransactionLink;
}

/**
 * @interface InputDataInterface
 * @member {string[]} owners_before
 * @member {unknown} fulfillment
 * @member {unknown} fulfills - Optional
 */
interface InputDataInterface {
    owners_before: string[];
    fulfillment: unknown;
    fulfills?: unknown;
}

/**
 * @interface InputDataMembers
 * @extends InputDataInterface
 * @member {string[]} owners_before
 * @member {Fulfillment} fulfillment
 * @member {TransactionLink} fulfills - Optional
 */
export interface InputDataMembers extends InputDataInterface {
    owners_before: string[];
    fulfillment: Fulfillment;
    fulfills?: TransactionLink;
}

/**
 * @interface InputDataMInputObjectSerializableembers
 * @extends InputDataInterface
 * @member {string[]} owners_before
 * @member {FulfillmentDetails | string}
 * @member {TransactionLinkConstructorConfig} fulfills - Optional
 */
export interface InputObjectSerializable extends InputDataInterface {
    owners_before: string[];
    fulfillment: FulfillmentDetails | string;
    fulfills?: TransactionLinkConstructorConfig;
}

/**
 * @interface TransactionLinkConstructorConfig
 * @member {string} txid - Optional
 * @member {number} output - Optional
 */
export interface TransactionLinkConstructorConfig {
    txid?: string;
    output?: number;
}

/**
 * @interface TransactionLinkSerializable
 * @member {string} txid - Optional
 * @member {number} output - Optional
 */
export interface TransactionLinkSerializable {
    txid?: string;
    output?: number;
}

/**
 * @interface FulfillmentDetails
 * @member {string} type
 */
export interface FulfillmentDetails {
    type: string;
}

/**
 * @interface Ed25519Sha256FulfillmentDetails
 * @extends FulfillmentDetails
 * @member {string} type
 * @member {string} public_key
 */
export interface Ed25519Sha256FulfillmentDetails extends FulfillmentDetails {
    type: string;
    public_key: string;
}

/**
 * @interface ThresholdSha256FulfillmentDetails
 * @extends FulfillmentDetails
 * @member {string} type
 * @member {number} threshold
 * @member {(PreimageSha256Json | PrefixSha256Json | ThresholdSha256Json | RsaSha256Json | Ed25519Sha256Json)[]} subfulfillments - Optional
 * @member {ConditionAsn1Json[]} subconditions - Optional
 */
export interface ThresholdSha256FulfillmentDetails extends FulfillmentDetails {
    type: string;
    threshold: number;
    subfulfillments?: (
        | PreimageSha256Json
        | PrefixSha256Json
        | ThresholdSha256Json
        | RsaSha256Json
        | Ed25519Sha256Json
    )[];
    subconditions?: ConditionAsn1Json[];
}

/**
 * @interface OutputObjectSerializable
 * @member {string[]} public_keys
 * @member {string} amount
 * @member {{details?: FulfillmentDetails, uri: string}} condition - conditon.details is Optional
 */
export interface OutputObjectSerializable {
    public_keys: string[];
    amount: string;
    condition: {
        details?: FulfillmentDetails;
        uri: string;
    };
}

/**
 * @interface OutputConstructorConfig
 * @member {string[]} public_keys
 * @member {number} amount
 */
export interface OutputConstructorConfig {
    public_keys: string[];
    amount: number;
}

/**
 * @interface TransactionConstructorConfig
 * @member {Input[]} inputs - Optional
 * @member {Output[]} outputs - Optional
 * @member {Record<string, unknown>} metadata - Optional
 * @member {string} version - Optional
 * @member {string} hash_id - Optional
 */
export interface TransactionConstructorConfig {
    inputs?: Input[];
    outputs?: Output[];
    metadata?: Record<string, unknown>;
    version?: string;
    hash_id?: string;
}

/**
 * @interface
 * @member {Record<string, unknown>} data
 */
export interface CreateAsset {
    data: Record<string, unknown> | undefined;
}

/**
 * @interface
 * @member {string} id
 */
export interface TransferAsset {
    id: string;
}

/**
 * @interface TransactionSerializable
 * @member {InputObjectSerializable[]} inputs - Optional
 * @member {OutputObjectSerializable[]} outputs - Optional
 * @member {TransactionOperationType} operation
 * @member {CreateAsset | TransferAsset | undefined} asset
 * @member {Record<string, any> | undefined} metadata
 * @member {string} version
 * @member {string | undefined} id
 */
export interface TransactionSerializable {
    [key: string]: unknown;
    inputs?: InputObjectSerializable[];
    outputs?: OutputObjectSerializable[];
    operation: TransactionOperationType;
    asset: CreateAsset | TransferAsset | undefined;
    metadata: Record<string, any> | undefined;
    version: string;
    id: string | undefined;
}

/**
 * @type Recipient
 * - Tuple with [string[], number]
 */
export type Recipient = [publicKeys: string[], amount: number];

/**
 * @interface CreateConfig
 * @member {Record<string, unknown>} metadata - Optional
 * @member {Record<string, unknown>} asset - Optional
 */
export interface CreateConfig {
    metadata?: Record<string, unknown>;
    asset?: Record<string, unknown>;
}

/**
 * @interface TransferConfig
 * @member {Record<string, unknown>} metadata - Optional
 */
export interface TransferConfig {
    metadata?: Record<string, unknown>;
}

/**
 * @type TransactionOperationType
 * - 2 Types: `CREATE` OR `TRANSFER`
 */
export type TransactionOperationType = 'CREATE' | 'TRANSFER';

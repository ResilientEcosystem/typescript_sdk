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
import { Fulfillment, ThresholdSha256 } from 'crypto-conditions';
import type { OutputObjectSerializable, OutputConstructorConfig, UnspentOutput, TransferConfig } from './interface';
import type { TransactionInterface, InputConstructorConfig, InputDataMembers, InputObjectSerializable, TransactionLinkConstructorConfig, TransactionConstructorConfig, TransferAsset, CreateAsset, TransactionSerializable, Recipient, CreateConfig, TransactionLinkSerializable, TransactionOperationType } from './interface';
declare class ResDB {
}
export declare class Input implements TransactionInterface {
    fulfillment: Fulfillment;
    fulfills: TransactionLink | undefined;
    owners_before: string[];
    constructor(fulfillment: Fulfillment, ownersBefore: string[], config?: InputConstructorConfig);
    isEqual(other: Input): boolean;
    toDict(): InputObjectSerializable | undefined;
    static generate(public_keys: string[]): Input;
    static fromDict(obj: InputObjectSerializable | InputDataMembers): Input | undefined;
    private static fulfillmentToDetails;
    private static fulfillmentFromDetails;
}
export declare class TransactionLink implements TransactionInterface {
    txid: string | undefined;
    output: number | undefined;
    constructor(config?: TransactionLinkConstructorConfig);
    static fromDict(obj: TransactionLinkSerializable): TransactionLink;
    toUri(path?: string): string | undefined;
    hash(): string;
    isValid(): boolean;
    isEqual(other: TransactionLink): boolean;
    toDict(): TransactionLinkSerializable | undefined;
    private isEmpty;
}
export declare class Output implements TransactionInterface {
    static readonly MAX_AMOUNT: number;
    static readonly MIN_AMOUNT: number;
    static readonly MIN_NUM_PUBLIC_KEYS: number;
    fulfillment: Fulfillment;
    amount: number;
    public_keys: string[];
    constructor(fulfillment: Fulfillment, config: OutputConstructorConfig);
    isEqual(other: Output): boolean;
    toDict(): OutputObjectSerializable;
    static fromDict(data: OutputObjectSerializable): [Output | undefined, Error | undefined];
    static generate(public_keys_or_fulfillment: string[] | Fulfillment, amount: number): Output;
    static genCondition(initialCondition: ThresholdSha256, new_public_keys: string[] | string | Fulfillment): [ThresholdSha256 | undefined, Error | undefined];
    private static genConditionWithPublicKeyString;
    private static genConditionWithPublicKeyArray;
    private static genConditionWithFulfilllment;
    private static generateWithPublicKeys;
    private static generateWithPublicKey;
    private static generateWithFulfillment;
}
export declare class Transaction {
    private static CREATE;
    private static TRANSFER;
    private static ALLOWED_OPERATIONS;
    private static DEFAULT_VERSION;
    static typeRegistry: Record<string, unknown>;
    version: string;
    operation: TransactionOperationType;
    asset: CreateAsset | TransferAsset | undefined;
    inputs: Input[];
    outputs: Output[];
    metadata: Record<string, unknown> | undefined;
    private _id;
    assetId: string | undefined;
    constructor(operation: TransactionOperationType, asset: CreateAsset | TransferAsset | undefined, config?: TransactionConstructorConfig);
    getUnspentOutput(): UnspentOutput[];
    getSpentOutputs(): TransactionLinkSerializable[];
    serialized(): string;
    toDict(): TransactionSerializable;
    private static _toStr;
    static create(tx_signers: string[], recipients: Recipient[], createConfig: CreateConfig): [Transaction | undefined, Error | undefined];
    static transfer(inputs: Input[], recipients: Recipient[], asset_id: string, transferConfig: TransferConfig): [Transaction | undefined, Error | undefined];
    isEqual(other: Transaction): boolean;
    toInputs(indices?: number[]): Input[];
    get id(): string | undefined;
    addOutput(output: Output): void;
    addInput(input: Input): void;
    sign(privateKeys: string[]): Transaction;
    private static genPublicKey;
    private static _removeSignatures;
    private _signInput;
    private static signSimpleSignatureFulfillment;
    private static signThresholdSignatureFulfillment;
    private static getSubconditionFromVerifyingKey;
    inputsValid(outputs: Output[]): boolean;
    private _inputsValid;
    private validate;
    private static _inputValid;
    to_hash(): string;
    private _hash;
    toString(): string;
    static getAssetId(transactions: Transaction[]): string;
    private static _to_hash;
    static validateId(txBody: TransactionSerializable): void;
    static fromDict(tx: TransactionSerializable, skipSchemaValidation?: boolean): Transaction;
    static fromDb(resdb: ResDB, // ResDB validator
    txDictList: TransactionSerializable | TransactionSerializable[]): Transaction | Transaction[];
    static registerType(txType: any, txClass: any): void;
    resolveClass(operation: TransactionOperationType): any;
    static validateSchema(tx: TransactionSerializable): void;
}
export {};

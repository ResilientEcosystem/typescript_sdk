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

import * as _ from 'lodash';
import * as elliptic from 'elliptic';
import * as CryptoJS from 'crypto';
import { Crypto } from '../Crypto/index';

import {
    FulfillmentToDetailsHelper,
    FulfillmentFromDetailsHelper,
    FulfillmentHelpers,
} from './transactionHelper';

import logger from '../utils/logger';

import { DataUtils } from '../utils/commonUtils';

import { TransactionInterfaceParamValidation } from './transactionHelper';

import {
    Ed25519Sha256,
    Fulfillment,
    ThresholdSha256,
    TypeAsn1Fulfillment,
} from 'crypto-conditions';

import {
    ValueError,
    ThresholdTooDeep,
    KeypairMismatchError,
    AssetIdMismatchError,
    InvalidHashError,
} from '../utils/errors';

import { Types } from 'crypto-conditions';

import type {
    FulfillmentDetails,
    OutputObjectSerializable,
    OutputConstructorConfig,
    UnspentOutput,
    TransferConfig,
} from './interface';

import type {
    TransactionInterface,
    InputConstructorConfig,
    InputDataMembers,
    InputObjectSerializable,
    TransactionLinkConstructorConfig,
    TransactionConstructorConfig,
    TransferAsset,
    CreateAsset,
    TransactionSerializable,
    Recipient,
    CreateConfig,
    TransactionLinkSerializable,
    TransactionOperationType,
} from './interface';

import type {
    Ed25519Sha256Json,
    PrefixSha256Json,
    PreimageSha256Json,
    RsaSha256Json,
    ThresholdSha256Json,
} from 'crypto-conditions/types/types';

class ResDB {} // import the validator, this mocks the actual validator ResDB class

export class Input implements TransactionInterface {
    public fulfillment: Fulfillment;
    public fulfills: TransactionLink | undefined;
    public owners_before: string[];

    public constructor(
        fulfillment: Fulfillment,
        ownersBefore: string[],
        config?: InputConstructorConfig
    ) {
        this.fulfillment = fulfillment;
        this.fulfills = config?.fulfills;
        this.owners_before = ownersBefore;
    }

    public isEqual(other: Input): boolean {
        const curObj: InputObjectSerializable | undefined = this.toDict();
        const otherObj: InputObjectSerializable | undefined = other.toDict();
        if (_.isUndefined(curObj) || _.isUndefined(otherObj)) {
            return false;
        }
        return curObj === otherObj;
    }

    public toDict(): InputObjectSerializable | undefined {
        let fulfillment: string | FulfillmentDetails;
        try {
            fulfillment = this.fulfillment.serializeUri();
        } catch (err) {
            logger.warn({
                err,
                vals: {
                    fulfillment: this.fulfillment,
                    fulfills: this.fulfills,
                },
            });
            const [details, error] = Input.fulfillmentToDetails(
                this.fulfillment
            );
            if (_.isUndefined(details)) {
                return undefined;
            }
            fulfillment = details;
        }
        const fulfills: TransactionLinkConstructorConfig | undefined =
            !_.isUndefined(this.fulfills) ? this.fulfills.toDict() : undefined;

        return {
            fulfills,
            fulfillment,
            owners_before: this.owners_before,
        };
    }

    public static generate(public_keys: string[]): Input {
        const output: Output = Output.generate(public_keys, 1);
        return new Input(output.fulfillment, public_keys);
    }

    public static fromDict(
        obj: InputObjectSerializable | InputDataMembers
    ): Input | undefined {
        let fulfillment: Fulfillment | undefined;
        if (typeof obj.fulfillment === 'string') {
            fulfillment = Fulfillment.fromUri(obj.fulfillment);
        } else if (obj.fulfillment instanceof Fulfillment) {
            fulfillment = obj.fulfillment;
        } else {
            fulfillment = Input.fulfillmentFromDetails(obj.fulfillment)[0];
        }

        if (_.isUndefined(fulfillment)) return undefined;

        let fulfillsObj: TransactionLink | undefined;

        if (obj.fulfills instanceof TransactionLink) {
            fulfillsObj = obj.fulfills;
        } else if (!_.isUndefined(obj.fulfills)) {
            fulfillsObj = TransactionLink.fromDict(obj.fulfills);
        }
        return new Input(fulfillment, obj.owners_before, {
            fulfills: fulfillsObj,
        });
    }

    private static fulfillmentToDetails(
        fulfillment: Fulfillment
    ): [FulfillmentDetails | undefined, Error | undefined] {
        return FulfillmentToDetailsHelper.fulfillmentToDetailsHandler(
            fulfillment
        );
    }

    private static fulfillmentFromDetails(
        data: FulfillmentDetails,
        _depth: number = 0
    ): [Fulfillment | undefined, Error | undefined] {
        if (_depth >= 100) {
            return [undefined, new ThresholdTooDeep('transaction')];
        }
        return FulfillmentFromDetailsHelper.fulfillmentFromDetailsHandler(
            data,
            _depth
        );
    }
}

export class TransactionLink implements TransactionInterface {
    public txid: string | undefined;
    public output: number | undefined;
    public constructor(config?: TransactionLinkConstructorConfig) {
        this.txid = config?.txid;
        this.output = config?.output;
    }
    public static fromDict(obj: TransactionLinkSerializable): TransactionLink {
        return new TransactionLink(obj);
    }

    public toUri(path: string = ''): string | undefined {
        if (!this.isValid()) {
            return undefined;
        }
        return `${path}/transactions/${this.txid}/outputs/${this.output}`;
    }

    public hash(): string {
        const dataToHash: string = JSON.stringify({
            txid: this.txid,
            output: this.output,
        });
        return CryptoJS.createHash('sha256').update(dataToHash).digest('hex');
    }

    public isValid(): boolean {
        return !_.isUndefined(this.txid) && !_.isUndefined(this.output);
    }

    public isEqual(other: TransactionLink): boolean {
        const curObj: TransactionLinkConstructorConfig | undefined =
            this.toDict();
        const otherObj: TransactionLinkConstructorConfig | undefined =
            other.toDict();
        if (_.isUndefined(curObj) || _.isUndefined(otherObj)) {
            return false;
        }
        return curObj === otherObj;
    }

    public toDict(): TransactionLinkSerializable | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return {
            txid: this.txid,
            output: this.output,
        };
    }

    private isEmpty(): boolean {
        return _.isUndefined(this.txid) && _.isUndefined(this.output);
    }
}

export class Output implements TransactionInterface {
    public static readonly MAX_AMOUNT: number = 9 * 10 ** 18;
    public static readonly MIN_AMOUNT: number = 1;
    public static readonly MIN_NUM_PUBLIC_KEYS: number = 1;
    public fulfillment: Fulfillment;
    public amount: number;
    public public_keys: string[];
    public constructor(
        fulfillment: Fulfillment,
        config: OutputConstructorConfig
    ) {
        if (config.amount < Output.MIN_AMOUNT) {
            throw new ValueError('amount cannot be nonpositive');
        }

        if (config.amount > Output.MAX_AMOUNT) {
            throw new ValueError(
                `amount cannot be greater than ${Output.MAX_AMOUNT}`
            );
        }
        this.amount = config.amount;
        this.fulfillment = fulfillment;
        this.public_keys = config.public_keys;
    }

    public isEqual(other: Output): boolean {
        const curObj: OutputObjectSerializable = this.toDict();
        const otherObj: OutputObjectSerializable = other.toDict();
        if (_.isUndefined(curObj) || _.isUndefined(otherObj)) return false;
        return this.toDict() === other.toDict();
    }

    public toDict(): OutputObjectSerializable {
        const [details]: [FulfillmentDetails | undefined, Error | undefined] =
            FulfillmentToDetailsHelper.fulfillmentToDetailsHandler(
                this.fulfillment
            );
        return {
            public_keys: this.public_keys,
            condition: {
                details,
                uri: this.fulfillment.getConditionUri(),
            },
            amount: this.amount.toString(),
        };
    }

    public static fromDict(
        data: OutputObjectSerializable
    ): [Output | undefined, Error | undefined] {
        let fulfillment: Fulfillment | undefined;
        if (!_.isUndefined(data.condition.details)) {
            const [convertedFulfillment, err] =
                FulfillmentFromDetailsHelper.fulfillmentFromDetailsHandler(
                    data.condition.details
                );
            if (!_.isUndefined(convertedFulfillment)) {
                fulfillment = convertedFulfillment;
            }
        } else {
            fulfillment = Fulfillment.fromUri(data.condition.uri);
        }
        if (_.isUndefined(fulfillment)) {
            return [
                undefined,
                new ValueError(
                    'fulfillment is undefined due to improper conversion'
                ),
            ];
        }
        const amount: number = parseInt(data.amount);

        return [
            new Output(fulfillment, { amount, public_keys: data.public_keys }),
            undefined,
        ];
    }

    public static generate(
        public_keys_or_fulfillment: string[] | Fulfillment,
        amount: number
    ): Output {
        if (public_keys_or_fulfillment instanceof Fulfillment) {
            return Output.generateWithFulfillment(
                public_keys_or_fulfillment,
                amount
            );
        }
        return Output.generateWithPublicKeys(
            public_keys_or_fulfillment,
            amount
        );
    }

    public static genCondition(
        initialCondition: ThresholdSha256,
        new_public_keys: string[] | string | Fulfillment
    ): [ThresholdSha256 | undefined, Error | undefined] {
        if (typeof new_public_keys === 'string') {
            return Output.genConditionWithPublicKeyString(
                initialCondition,
                new_public_keys
            );
        }
        if (Array.isArray(new_public_keys)) {
            return Output.genConditionWithPublicKeyArray(
                initialCondition,
                new_public_keys
            );
        }

        return Output.genConditionWithFulfilllment(
            initialCondition,
            new_public_keys
        );
    }

    private static genConditionWithPublicKeyString(
        initialCondition: ThresholdSha256,
        public_key: string
    ): [ThresholdSha256 | undefined, Error | undefined] {
        const fulfillment: Ed25519Sha256 = new Ed25519Sha256();
        fulfillment.setPublicKey(Buffer.from(public_key));
        initialCondition.addSubfulfillment(fulfillment);
        return [initialCondition, undefined];
    }

    private static genConditionWithPublicKeyArray(
        initialCondition: ThresholdSha256,
        new_public_keys: string[]
    ): [ThresholdSha256 | undefined, Error | undefined] {
        const threshold: number = new_public_keys.length;
        if (threshold <= 1) {
            return [
                undefined,
                new ValueError(
                    'threshold: sublist cannot contain a single owner'
                ),
            ];
        }
        const fulfillment: ThresholdSha256 = new ThresholdSha256();
        fulfillment.setThreshold(threshold);
        _.map(new_public_keys, (key) => this.genCondition(fulfillment, key));
        initialCondition.addSubfulfillment(fulfillment);
        return [initialCondition, undefined];
    }

    private static genConditionWithFulfilllment(
        initialCondition: ThresholdSha256,
        fulfillment: Fulfillment
    ): [ThresholdSha256 | undefined, Error | undefined] {
        initialCondition.addSubfulfillment(fulfillment);
        return [initialCondition, undefined];
    }

    private static generateWithPublicKeys(
        public_keys: string[],
        amount: number
    ): Output {
        if (amount < Output.MIN_AMOUNT) {
            throw new ValueError('amount cannot be nonpositive');
        }

        const threshold: number = public_keys.length;

        if (threshold < Output.MIN_NUM_PUBLIC_KEYS) {
            throw new ValueError('public_keys cannot be of length 0');
        }

        if (threshold === Output.MIN_NUM_PUBLIC_KEYS) {
            return this.generateWithPublicKey(public_keys[0], amount);
        }
        // threshold conditions not supported by resdb
        const initCond: ThresholdSha256 = new ThresholdSha256();

        // once supported use this, not sure this is correct
        // const threshold_cond: ThresholdSha256 = new ThresholdSha256();
        _.map(public_keys, (key) => this.genCondition(initCond, key));

        return new Output(initCond, { public_keys, amount });
    }

    private static generateWithPublicKey(
        public_key: string,
        amount: number
    ): Output {
        if (amount < Output.MIN_AMOUNT) {
            throw new ValueError('amount cannot be nonpositive');
        }
        const fulfillment: Ed25519Sha256 = new Ed25519Sha256();
        fulfillment.setPublicKey(Buffer.from(public_key));
        return new Output(fulfillment, { public_keys: [public_key], amount });
    }

    private static generateWithFulfillment(
        fulfillment: Fulfillment,
        amount: number
    ): Output {
        if (amount < Output.MIN_AMOUNT) {
            throw new ValueError('amount cannot be nonpositive');
        }
        return new Output(fulfillment, {
            public_keys: [
                FulfillmentHelpers.getAsn1JsonValue<TypeAsn1Fulfillment.Ed25519Sha256>(
                    fulfillment
                ).publicKey,
            ],
            amount,
        });
    }
}

export class Transaction {
    private static CREATE: TransactionOperationType = 'CREATE';
    private static TRANSFER: TransactionOperationType = 'TRANSFER';
    private static ALLOWED_OPERATIONS: Set<string> = new Set([
        Transaction.CREATE,
        Transaction.TRANSFER,
    ]);
    private static DEFAULT_VERSION: string = '2.0';

    public static typeRegistry: Record<string, unknown> = {}; // more context needed;

    public version: string;
    public operation: TransactionOperationType;
    public asset: CreateAsset | TransferAsset | undefined;
    public inputs: Input[];
    public outputs: Output[];
    public metadata: Record<string, unknown> | undefined;
    private _id: string | undefined;
    public assetId: string | undefined;

    public constructor(
        operation: TransactionOperationType,
        asset: CreateAsset | TransferAsset | undefined,
        config?: TransactionConstructorConfig
    ) {
        if (!Transaction.ALLOWED_OPERATIONS.has(operation)) {
            throw new ValueError('invalid operation');
        }

        switch (operation) {
            case Transaction.CREATE:
                if (
                    !TransactionInterfaceParamValidation.isValidConstructorCreateTransaction(
                        asset as CreateAsset
                    )
                ) {
                    throw new TypeError(
                        'invalid asset for create transaction. asset must either be none or a record holding a non-undefined data'
                    );
                }
                break;
            case Transaction.TRANSFER:
                if (
                    !TransactionInterfaceParamValidation.isValidConstructorTransferTransaction(
                        asset as TransferAsset
                    )
                ) {
                    throw new TypeError(
                        'invalid asset for transfer transaction. asset must be a record holding a non-undefined id property'
                    );
                }
                break;
            default:
                throw new ValueError('invalid operation');
        }

        this.version = config?.version ?? Transaction.DEFAULT_VERSION;
        this.operation = operation;
        this.asset = asset;
        this.inputs = config?.inputs ?? [];
        this.outputs = config?.outputs ?? [];
        this.metadata = config?.metadata;
        this._id = config?.hash_id;
    }

    public getUnspentOutput(): UnspentOutput[] {
        if (_.isUndefined(this.outputs)) {
            return [];
        }

        switch (this.operation) {
            case Transaction.CREATE:
                this.assetId = this._id;
                break;
            case Transaction.TRANSFER:
                this.assetId = (this.asset as TransferAsset).id;
                break;
            default:
                throw new TypeError(
                    'invalid transaction type, something wrong with the class implementation'
                );
        }

        if (_.isUndefined(this.assetId || _.isUndefined(this._id))) {
            return [];
        }

        return _.map<Output, UnspentOutput>(
            this.outputs,
            (output, output_index) => ({
                transaction_id: this._id as string, // guaranteed by the above check
                output_index: output_index,
                amount: output.amount,
                asset_id: this.assetId as string, // guaranteed by the above check
                condition_uri: output.fulfillment.getConditionUri(),
            })
        );
    }

    public getSpentOutputs(): TransactionLinkSerializable[] {
        if (_.isUndefined(this.inputs)) {
            return [];
        }
        return _.chain(this.inputs)
            .map<TransactionLinkSerializable | undefined>(
                (input) => input?.fulfills?.toDict()
            )
            .filter((input) => !_.isUndefined(input))
            .value() as TransactionLinkSerializable[];
    }

    public serialized(): string {
        return Transaction._toStr(this.toDict());
    }

    public toDict(): TransactionSerializable {
        return {
            inputs: _.chain(this.inputs)
                .map((input) => input.toDict())
                .filter((input) => !_.isUndefined(input))
                .value() as InputObjectSerializable[],
            outputs: _.map(this.outputs, (output) => output.toDict()),
            operation: this.operation,
            metadata: this.metadata,
            asset: this.asset,
            version: this.version,
            id: this._id,
        };
    }

    private static _toStr(value: TransactionSerializable): string {
        return DataUtils.serialize(value);
    }

    public static create(
        tx_signers: string[],
        recipients: Recipient[],
        createConfig: CreateConfig
    ): [Transaction | undefined, Error | undefined] {
        const [isValidCreate, err]: [boolean, Error | undefined] =
            TransactionInterfaceParamValidation.isValidCreateTransaction(
                tx_signers,
                recipients
            );
        if (!isValidCreate) {
            return [undefined, err];
        }
        const outputs: Output[] = _.map<Recipient, Output>(
            recipients,
            ([publicKeys, amount]) => Output.generate(publicKeys, amount)
        );
        const inputs: Input[] = [Input.generate(tx_signers)];
        let transactionInstance: Transaction | undefined;
        try {
            transactionInstance = new Transaction(
                Transaction.CREATE,
                { data: createConfig?.asset },
                { inputs, outputs, metadata: createConfig?.metadata }
            );
        } catch (err) {
            return [undefined, err];
        }
        return [transactionInstance, undefined];
    }

    public static transfer(
        inputs: Input[],
        recipients: Recipient[],
        asset_id: string,
        transferConfig: TransferConfig
    ): [Transaction | undefined, Error | undefined] {
        const [isValidCall, err]: [boolean | undefined, Error | undefined] =
            TransactionInterfaceParamValidation.isValidTransferTransaction(
                inputs,
                recipients
            );
        if (!isValidCall) {
            return [undefined, err];
        }
        const outputs: Output[] = _.map<Recipient, Output>(
            recipients,
            ([publicKeys, amount]) => Output.generate(publicKeys, amount)
        );
        const deepInputCopy: Input[] = _.cloneDeep(inputs);

        let transferTransaction: Transaction | undefined;

        try {
            transferTransaction = new Transaction(
                Transaction.TRANSFER,
                { id: asset_id },
                {
                    inputs: deepInputCopy,
                    outputs,
                    metadata: transferConfig?.metadata,
                }
            );
        } catch (err) {
            return [undefined, err];
        }
        return [transferTransaction, undefined];
    }

    public isEqual(other: Transaction): boolean {
        let otherSerializable: TransactionSerializable | undefined;
        let thisSerializable: TransactionSerializable | undefined;
        try {
            otherSerializable = other.toDict();
            thisSerializable = this.toDict();
        } catch (err) {
            return false;
        }
        if (
            !_.isUndefined(otherSerializable) ||
            !_.isUndefined(thisSerializable)
        ) {
            return false;
        }
        return true;
    }
    public toInputs(indices?: number[]): Input[] {
        if (!_.isUndefined(indices)) {
            if (indices.length == 0) {
                throw new ValueError('length cannot be 0');
            }
            const max: number = _.max(indices);
            const min: number = _.min(indices);
            if (max >= this.outputs.length) {
                throw new ValueError('max value of indices >= len of outputs');
            }
            if (min < 0) {
                throw new ValueError('min value of the indices < 0');
            }
            return _.map<number, Input>(
                indices,
                (idx) =>
                    new Input(
                        this.outputs[idx].fulfillment,
                        this.outputs[idx].public_keys,
                        {
                            fulfills: new TransactionLink({
                                txid: this.id,
                                output: idx,
                            }),
                        }
                    )
            );
        }
        return _.map<Output, Input>(
            this.outputs,
            (output, idx) =>
                new Input(output.fulfillment, output.public_keys, {
                    fulfills: new TransactionLink({
                        txid: this.id,
                        output: idx,
                    }),
                })
        );
    }
    get id(): string | undefined {
        return this._id;
    }
    public addOutput(output: Output): void {
        this.outputs.push(output);
    }

    public addInput(input: Input): void {
        this.inputs.push(input);
    }

    public sign(privateKeys: string[]): Transaction {
        const keypairs: Record<string, string> = {};
        for (const privateKey of privateKeys) {
            keypairs[Transaction.genPublicKey(privateKey)] = privateKey;
        }
        const txDict: TransactionSerializable = this.toDict();
        const txDictWithoutSignatures: TransactionSerializable =
            Transaction._removeSignatures(txDict);
        const txSerialized: string = Transaction._toStr(
            txDictWithoutSignatures
        );
        for (let input of this.inputs) {
            input = this._signInput(input, txSerialized, keypairs);
        }

        this._hash();

        return this;
    }

    private static genPublicKey(privateKey: string): string {
        const curve: elliptic.eddsa = new elliptic.eddsa('ed25519');
        return curve.keyFromSecret(privateKey).getPublic('hex');
    }

    private static _removeSignatures(
        txDict: TransactionSerializable
    ): TransactionSerializable {
        const txDictCopy: TransactionSerializable = _.cloneDeep(txDict);

        for (const input of txDictCopy['inputs']) {
            input.fulfillment = undefined;
        }
        return txDictCopy;
    }

    private _signInput(
        input: Input,
        message: string,
        keyPairs: Record<string, string>
    ): Input {
        if (input.fulfillment instanceof Ed25519Sha256) {
            return Transaction.signSimpleSignatureFulfillment(
                input,
                message,
                keyPairs
            );
        }

        if (input.fulfillment instanceof ThresholdSha256) {
            return Transaction.signThresholdSignatureFulfillment(
                input,
                message,
                keyPairs
            );
        }

        throw new ValueError('invalid condition');
    }

    private static signSimpleSignatureFulfillment(
        input: Input,
        message: string,
        keyPairs: Record<string, string>
    ): Input {
        const publicKey: string = input.owners_before[0];
        if (_.isUndefined(keyPairs[publicKey])) {
            throw new KeypairMismatchError('public key');
        }
        const inputCopy: Input = _.cloneDeep(input);
        let hashedMessage: string = CryptoJS.createHash('sha3-256')
            .update(message)
            .digest('hex');
        const { txid, output }: TransactionLink = inputCopy.fulfills;
        hashedMessage = CryptoJS.createHash('sha3-256')
            .update(`${hashedMessage}${txid}${output}`)
            .digest('hex');
        (inputCopy.fulfillment as Ed25519Sha256).sign(
            Buffer.from(hashedMessage),
            Buffer.from(keyPairs[publicKey])
        );
        return inputCopy;
    }

    private static signThresholdSignatureFulfillment(
        input: Input,
        message: string,
        keyPairs: Record<string, string>
    ): Input {
        const inputCopy: Input = _.cloneDeep(input);
        let hashedMessage: string = CryptoJS.createHash('sha3-256')
            .update(message)
            .digest('hex');
        const { txid, output }: TransactionLink = inputCopy.fulfills;
        hashedMessage = CryptoJS.createHash('sha3-256')
            .update(`${hashedMessage}${txid}${output}`)
            .digest('hex');
        for (const owner_before of new Set(inputCopy.owners_before)) {
            const subfulfills: Fulfillment[] =
                Transaction.getSubconditionFromVerifyingKey(
                    owner_before,
                    input.fulfillment
                );
            if (subfulfills.length == 0) {
                throw new KeypairMismatchError(
                    `Public key ${owner_before} cannot be found`
                );
            }
            const privateKey: string | undefined = keyPairs[owner_before];
            if (!privateKey) {
                throw new KeypairMismatchError(
                    `public key ${owner_before} is not a key pair`
                );
            }
            for (let sub of subfulfills) {
                (sub as Ed25519Sha256).sign(
                    Buffer.from(message),
                    Buffer.from(privateKey)
                );
            }
        }

        return inputCopy;
    }

    private static getSubconditionFromVerifyingKey(
        key: string,
        fulfillment: Fulfillment
    ): Fulfillment[] {
        let conditions: Fulfillment[] = [];
        const subfulfillments: (
            | ThresholdSha256Json
            | PreimageSha256Json
            | PrefixSha256Json
            | RsaSha256Json
            | Ed25519Sha256Json
        )[] =
            FulfillmentHelpers.getAsn1JsonValue<TypeAsn1Fulfillment.ThresholdSha256>(
                fulfillment
            ).subfulfillments;

        for (const sub of subfulfillments) {
            if (sub.type === Types.Ed25519Sha256) {
                if (sub.publicKey != key) {
                    continue;
                }
                conditions.push(Fulfillment.fromJson(sub));
                continue;
            }

            if (sub.type === Types.ThresholdSha256) {
                const result: Fulfillment[] =
                    Transaction.getSubconditionFromVerifyingKey(
                        key,
                        Fulfillment.fromJson(sub)
                    );
                if (result.length > 0) {
                    conditions = _.concat(conditions, result);
                }
            }
        }
        return conditions;
    }

    public inputsValid(outputs: Output[]): boolean {
        switch (this.operation) {
            case Transaction.CREATE:
                return this._inputsValid(
                    new Array(this.inputs.length).fill('dummyvalue')
                );
            case Transaction.TRANSFER:
                return this._inputsValid(
                    _.map<Output, string>(outputs, (output) =>
                        output.fulfillment.getConditionUri()
                    )
                );
            default:
                throw new ValueError('invalid operation');
        }
    }

    private _inputsValid(outputConditionUris: string[] = []): boolean {
        if (this.inputs.length !== outputConditionUris.length) {
            throw new ValueError(
                'inputs and output conditons must have the same length'
            );
        }
        let txDict: TransactionSerializable = this.toDict();
        txDict = Transaction._removeSignatures(txDict);
        txDict[this.id] = undefined;
        const txSerialized: string = Transaction._toStr(txDict);
        return _.chain(outputConditionUris)
            .map((outputConditionUri, idx) =>
                this.validate(
                    this.inputs[idx],
                    this.operation,
                    txSerialized,
                    idx,
                    outputConditionUri
                )
            )
            .every((cond) => cond)
            .value();
    }

    private validate(
        input: Input,
        operation: TransactionOperationType,
        txSerialized: string,
        idx: number,
        outputConditionUri?: string
    ): boolean {
        return Transaction._inputValid(
            input,
            operation,
            txSerialized,
            idx,
            outputConditionUri
        );
    }

    private static _inputValid(
        input: Input,
        operation: TransactionOperationType,
        message: string,
        idx: number,
        outputConditionUri?: string
    ): boolean {
        const ccfill: Fulfillment = input.fulfillment;
        let parsedFulfillment: Fulfillment | undefined;
        try {
            parsedFulfillment = Fulfillment.fromUri(ccfill.serializeUri());
        } catch (err) {
            logger.error('parsedFulfillment conversion not possible', { err });
            return false;
        }
        let isOutputValid: boolean = false;
        if (operation == Transaction.CREATE) {
            isOutputValid = true;
        } else {
            isOutputValid = outputConditionUri === ccfill.getConditionUri();
        }

        let hashedMessage: string = CryptoJS.createHash('sha3-256')
            .update(message)
            .digest('hex');
        const { txid, output }: TransactionLink = input.fulfills;
        hashedMessage = CryptoJS.createHash('sha3-256')
            .update(`${hashedMessage}${txid}${output}`)
            .digest('hex');
        const isFulfillmentValid: boolean = parsedFulfillment.validate(
            Buffer.from(hashedMessage)
        );
        return isOutputValid && isFulfillmentValid;
    }

    public to_hash(): string {
        return this.toDict()['id'];
    }

    private _hash(): void {
        this._id = Crypto.hashData(this.serialized());
    }

    // TODO: this method shouldn't call `_removeSignatures`
    public toString(): string {
        const tx: TransactionSerializable = Transaction._removeSignatures(
            this.toDict()
        );
        return Transaction._toStr(tx);
    }

    public static getAssetId(transactions: Transaction[]): string {
        if (transactions.length == 0) {
            throw new ValueError('transactions cannot be empty');
        }
        const assetIds: Set<string> = new Set();
        for (const transaction of transactions) {
            if (transaction.operation === Transaction.CREATE) {
                assetIds.add(transaction._id);
                continue;
            }
            assetIds.add(transaction.asset['id']);
        }
        if (assetIds.size > 1) {
            throw new AssetIdMismatchError(
                'assetIds.length',
                'there should only be one asset'
            );
        }

        return assetIds[0];
    }

    private static _to_hash(value: string): string {
        return Crypto.hashData(value);
    }

    public static validateId(txBody: TransactionSerializable) {
        const txBodyCopy: TransactionSerializable = _.cloneDeep(txBody);
        if (_.isUndefined(txBodyCopy['id'])) {
            throw new InvalidHashError(
                "txBody['id']",
                'No transaction id found!'
            );
        }
        const proposedTxId: string = txBody.id;
        txBodyCopy.id = undefined;
        const txBodySerialized: string = Transaction._toStr(txBodyCopy);
        const validTxId = Transaction._to_hash(txBodySerialized);

        if (proposedTxId !== validTxId) {
            throw new InvalidHashError(
                'proposedTxId',
                'proposedTxId is not equal to validTxId'
            );
        }
    }

    public static fromDict(
        tx: TransactionSerializable,
        skipSchemaValidation: boolean = true
    ): Transaction {
        const inputs: Input[] = _.map(tx.inputs, (txInput) =>
            Input.fromDict(txInput)
        );
        const outputs: Output[] = _.map(
            tx.outputs,
            (txOutput) => Output.fromDict(txOutput)[0]
        );

        if (!skipSchemaValidation) {
            Transaction.validateId(tx);
            Transaction.validateSchema(tx);
        }
        return new Transaction(tx.operation, tx.asset, {
            inputs,
            outputs,
            metadata: tx.metadata,
            version: tx.version,
            hash_id: tx.id,
        });
    }

    // BEYOND HERE NEEDS MORE WORK

    // TODO: Find the real type of txDictList
    public static fromDb(
        resdb: ResDB, // ResDB validator
        txDictList: TransactionSerializable | TransactionSerializable[]
    ): Transaction | Transaction[] {
        let shouldReturnList: boolean = true;

        if (!Array.isArray(txDictList)) {
            txDictList = [txDictList];
            shouldReturnList = false;
        }
        const txMap: Record<string, TransactionSerializable> = {};
        const txIds: string[] = [];

        for (let tx of txDictList) {
            tx.metadata = undefined;
            txMap[tx.id] = tx;
            txIds.push(tx.id);
        }
        const assets: any = _.toArray((resdb as any).get_assets(txIds)); // CHANGE; VALIDATION NEEDED

        for (let asset of assets) {
            if (!asset) {
                continue;
            }
            let tx: any = txMap[asset.id]; // change when there is more context
            delete asset['id'];
            tx['asset'] = asset;
        }
        const txIdsList: string[] = _.toArray(
            Object.keys(txMap) as Array<string>
        );
        const metadataList: any[] = _.toArray(
            (resdb as any).get_metadata(txIdsList)
        ); // THIS NEEDS TO BE CHANGED

        for (let metadata of metadataList) {
            let tx: any = txMap[metadata.id]; //change when there is more context
            tx.metadata = metadata?.metadata;
        }

        if (shouldReturnList) {
            const txList: any[] = []; //change when there is more context
            for (const [txId, tx] of Object.entries(txMap)) {
                txList.push(
                    Transaction.fromDict(tx as TransactionSerializable)
                ); // check context
            }
            return txList;
        }
        return Transaction.fromDict(Object.values(txMap)[0]);
    }

    // more context is needed for these functions use `any for now`
    public static registerType(txType: any, txClass: any): void {
        Transaction.typeRegistry[txType] = txClass;
    }

    public resolveClass(operation: TransactionOperationType): any {
        // more context is needed for this return type
        const createTxnClass: any =
            Transaction.typeRegistry[Transaction.CREATE]; // more context needed for type
        return Transaction.typeRegistry[operation] || createTxnClass;
    }

    public static validateSchema(tx: TransactionSerializable): void {
        /**
         * NOT IMPLEMENTED
         * TODO
         */
    }

    // // more context need for the types
    // public validateTransferInputs(resdb: ResDB, currentTransactions: any[]) : any {
    //     const inputTxs: [] = []
    //     const inputConditions: [] = []

    //     for (const input of this.inputs) {
    //         let inputTxId = input.fulfills.txid
    //         let inputTx = (resdb as any).get_transaction(inputTxId) // this needs to be changed

    //         if (!inputTx) {
    //             for (const curTx in currentTransactions) {
    //                 // this needs to be changed
    //                 if ((curTx as any).id === inputTxId) {
    //                     inputTx = curTx
    //                 }
    //             }
    //         }
    //         if (!inputTx) {
    //             throw new InputDoesNotExist(`input txid ${inputTxId} does not exist`)
    //         }

    //     }
    // }
}

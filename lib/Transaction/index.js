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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Output = exports.TransactionLink = exports.Input = void 0;
const _ = __importStar(require("lodash"));
const elliptic = __importStar(require("elliptic"));
const CryptoJS = __importStar(require("crypto"));
const index_1 = require("../Crypto/index");
const transactionHelper_1 = require("./transactionHelper");
const logger_1 = __importDefault(require("../utils/logger"));
const commonUtils_1 = require("../utils/commonUtils");
const transactionHelper_2 = require("./transactionHelper");
const crypto_conditions_1 = require("crypto-conditions");
const errors_1 = require("../utils/errors");
const crypto_conditions_2 = require("crypto-conditions");
class ResDB {
} // import the validator, this mocks the actual validator ResDB class
class Input {
    constructor(fulfillment, ownersBefore, config) {
        this.fulfillment = fulfillment;
        this.fulfills = config === null || config === void 0 ? void 0 : config.fulfills;
        this.owners_before = ownersBefore;
    }
    isEqual(other) {
        const curObj = this.toDict();
        const otherObj = other.toDict();
        if (_.isUndefined(curObj) || _.isUndefined(otherObj)) {
            return false;
        }
        return curObj === otherObj;
    }
    toDict() {
        let fulfillment;
        try {
            fulfillment = this.fulfillment.serializeUri();
        }
        catch (err) {
            logger_1.default.warn({
                err,
                vals: {
                    fulfillment: this.fulfillment,
                    fulfills: this.fulfills,
                },
            });
            const [details, error] = Input.fulfillmentToDetails(this.fulfillment);
            if (_.isUndefined(details)) {
                return undefined;
            }
            fulfillment = details;
        }
        const fulfills = !_.isUndefined(this.fulfills) ? this.fulfills.toDict() : undefined;
        return {
            fulfills,
            fulfillment,
            owners_before: this.owners_before,
        };
    }
    static generate(public_keys) {
        const output = Output.generate(public_keys, 1);
        return new Input(output.fulfillment, public_keys);
    }
    static fromDict(obj) {
        let fulfillment;
        if (typeof obj.fulfillment === 'string') {
            fulfillment = crypto_conditions_1.Fulfillment.fromUri(obj.fulfillment);
        }
        else if (obj.fulfillment instanceof crypto_conditions_1.Fulfillment) {
            fulfillment = obj.fulfillment;
        }
        else {
            fulfillment = Input.fulfillmentFromDetails(obj.fulfillment)[0];
        }
        if (_.isUndefined(fulfillment))
            return undefined;
        let fulfillsObj;
        if (obj.fulfills instanceof TransactionLink) {
            fulfillsObj = obj.fulfills;
        }
        else if (!_.isUndefined(obj.fulfills)) {
            fulfillsObj = TransactionLink.fromDict(obj.fulfills);
        }
        return new Input(fulfillment, obj.owners_before, {
            fulfills: fulfillsObj,
        });
    }
    static fulfillmentToDetails(fulfillment) {
        return transactionHelper_1.FulfillmentToDetailsHelper.fulfillmentToDetailsHandler(fulfillment);
    }
    static fulfillmentFromDetails(data, _depth = 0) {
        if (_depth >= 100) {
            return [undefined, new errors_1.ThresholdTooDeep('transaction')];
        }
        return transactionHelper_1.FulfillmentFromDetailsHelper.fulfillmentFromDetailsHandler(data, _depth);
    }
}
exports.Input = Input;
class TransactionLink {
    constructor(config) {
        this.txid = config === null || config === void 0 ? void 0 : config.txid;
        this.output = config === null || config === void 0 ? void 0 : config.output;
    }
    static fromDict(obj) {
        return new TransactionLink(obj);
    }
    toUri(path = '') {
        if (!this.isValid()) {
            return undefined;
        }
        return `${path}/transactions/${this.txid}/outputs/${this.output}`;
    }
    hash() {
        const dataToHash = JSON.stringify({
            txid: this.txid,
            output: this.output,
        });
        return CryptoJS.createHash('sha256').update(dataToHash).digest('hex');
    }
    isValid() {
        return !_.isUndefined(this.txid) && !_.isUndefined(this.output);
    }
    isEqual(other) {
        const curObj = this.toDict();
        const otherObj = other.toDict();
        if (_.isUndefined(curObj) || _.isUndefined(otherObj)) {
            return false;
        }
        return curObj === otherObj;
    }
    toDict() {
        if (this.isEmpty()) {
            return undefined;
        }
        return {
            txid: this.txid,
            output: this.output,
        };
    }
    isEmpty() {
        return _.isUndefined(this.txid) && _.isUndefined(this.output);
    }
}
exports.TransactionLink = TransactionLink;
class Output {
    constructor(fulfillment, config) {
        if (config.amount < Output.MIN_AMOUNT) {
            throw new errors_1.ValueError('amount cannot be nonpositive');
        }
        if (config.amount > Output.MAX_AMOUNT) {
            throw new errors_1.ValueError(`amount cannot be greater than ${Output.MAX_AMOUNT}`);
        }
        this.amount = config.amount;
        this.fulfillment = fulfillment;
        this.public_keys = config.public_keys;
    }
    isEqual(other) {
        const curObj = this.toDict();
        const otherObj = other.toDict();
        if (_.isUndefined(curObj) || _.isUndefined(otherObj))
            return false;
        return this.toDict() === other.toDict();
    }
    toDict() {
        const [details] = transactionHelper_1.FulfillmentToDetailsHelper.fulfillmentToDetailsHandler(this.fulfillment);
        return {
            public_keys: this.public_keys,
            condition: {
                details,
                uri: this.fulfillment.getConditionUri(),
            },
            amount: this.amount.toString(),
        };
    }
    static fromDict(data) {
        let fulfillment;
        if (!_.isUndefined(data.condition.details)) {
            const [convertedFulfillment, err] = transactionHelper_1.FulfillmentFromDetailsHelper.fulfillmentFromDetailsHandler(data.condition.details);
            if (!_.isUndefined(convertedFulfillment)) {
                fulfillment = convertedFulfillment;
            }
        }
        else {
            fulfillment = crypto_conditions_1.Fulfillment.fromUri(data.condition.uri);
        }
        if (_.isUndefined(fulfillment)) {
            return [
                undefined,
                new errors_1.ValueError('fulfillment is undefined due to improper conversion'),
            ];
        }
        const amount = parseInt(data.amount);
        return [
            new Output(fulfillment, { amount, public_keys: data.public_keys }),
            undefined,
        ];
    }
    static generate(public_keys_or_fulfillment, amount) {
        if (public_keys_or_fulfillment instanceof crypto_conditions_1.Fulfillment) {
            return Output.generateWithFulfillment(public_keys_or_fulfillment, amount);
        }
        return Output.generateWithPublicKeys(public_keys_or_fulfillment, amount);
    }
    static genCondition(initialCondition, new_public_keys) {
        if (typeof new_public_keys === 'string') {
            return Output.genConditionWithPublicKeyString(initialCondition, new_public_keys);
        }
        if (Array.isArray(new_public_keys)) {
            return Output.genConditionWithPublicKeyArray(initialCondition, new_public_keys);
        }
        return Output.genConditionWithFulfilllment(initialCondition, new_public_keys);
    }
    static genConditionWithPublicKeyString(initialCondition, public_key) {
        const fulfillment = new crypto_conditions_1.Ed25519Sha256();
        fulfillment.setPublicKey(Buffer.from(public_key));
        initialCondition.addSubfulfillment(fulfillment);
        return [initialCondition, undefined];
    }
    static genConditionWithPublicKeyArray(initialCondition, new_public_keys) {
        const threshold = new_public_keys.length;
        if (threshold <= 1) {
            return [
                undefined,
                new errors_1.ValueError('threshold: sublist cannot contain a single owner'),
            ];
        }
        const fulfillment = new crypto_conditions_1.ThresholdSha256();
        fulfillment.setThreshold(threshold);
        _.map(new_public_keys, (key) => this.genCondition(fulfillment, key));
        initialCondition.addSubfulfillment(fulfillment);
        return [initialCondition, undefined];
    }
    static genConditionWithFulfilllment(initialCondition, fulfillment) {
        initialCondition.addSubfulfillment(fulfillment);
        return [initialCondition, undefined];
    }
    static generateWithPublicKeys(public_keys, amount) {
        if (amount < Output.MIN_AMOUNT) {
            throw new errors_1.ValueError('amount cannot be nonpositive');
        }
        const threshold = public_keys.length;
        if (threshold < Output.MIN_NUM_PUBLIC_KEYS) {
            throw new errors_1.ValueError('public_keys cannot be of length 0');
        }
        if (threshold === Output.MIN_NUM_PUBLIC_KEYS) {
            return this.generateWithPublicKey(public_keys[0], amount);
        }
        // threshold conditions not supported by resdb
        const initCond = new crypto_conditions_1.ThresholdSha256();
        // once supported use this, not sure this is correct
        // const threshold_cond: ThresholdSha256 = new ThresholdSha256();
        _.map(public_keys, (key) => this.genCondition(initCond, key));
        return new Output(initCond, { public_keys, amount });
    }
    static generateWithPublicKey(public_key, amount) {
        if (amount < Output.MIN_AMOUNT) {
            throw new errors_1.ValueError('amount cannot be nonpositive');
        }
        const fulfillment = new crypto_conditions_1.Ed25519Sha256();
        fulfillment.setPublicKey(Buffer.from(public_key));
        return new Output(fulfillment, { public_keys: [public_key], amount });
    }
    static generateWithFulfillment(fulfillment, amount) {
        if (amount < Output.MIN_AMOUNT) {
            throw new errors_1.ValueError('amount cannot be nonpositive');
        }
        return new Output(fulfillment, {
            public_keys: [
                transactionHelper_1.FulfillmentHelpers.getAsn1JsonValue(fulfillment).publicKey,
            ],
            amount,
        });
    }
}
exports.Output = Output;
Output.MAX_AMOUNT = 9 * Math.pow(10, 18);
Output.MIN_AMOUNT = 1;
Output.MIN_NUM_PUBLIC_KEYS = 1;
class Transaction {
    constructor(operation, asset, config) {
        var _a, _b, _c;
        if (!Transaction.ALLOWED_OPERATIONS.has(operation)) {
            throw new errors_1.ValueError('invalid operation');
        }
        switch (operation) {
            case Transaction.CREATE:
                if (!transactionHelper_2.TransactionInterfaceParamValidation.isValidConstructorCreateTransaction(asset)) {
                    throw new TypeError('invalid asset for create transaction. asset must either be none or a record holding a non-undefined data');
                }
                break;
            case Transaction.TRANSFER:
                if (!transactionHelper_2.TransactionInterfaceParamValidation.isValidConstructorTransferTransaction(asset)) {
                    throw new TypeError('invalid asset for transfer transaction. asset must be a record holding a non-undefined id property');
                }
                break;
            default:
                throw new errors_1.ValueError('invalid operation');
        }
        this.version = (_a = config === null || config === void 0 ? void 0 : config.version) !== null && _a !== void 0 ? _a : Transaction.DEFAULT_VERSION;
        this.operation = operation;
        this.asset = asset;
        this.inputs = (_b = config === null || config === void 0 ? void 0 : config.inputs) !== null && _b !== void 0 ? _b : [];
        this.outputs = (_c = config === null || config === void 0 ? void 0 : config.outputs) !== null && _c !== void 0 ? _c : [];
        this.metadata = config === null || config === void 0 ? void 0 : config.metadata;
        this._id = config === null || config === void 0 ? void 0 : config.hash_id;
    }
    getUnspentOutput() {
        if (_.isUndefined(this.outputs)) {
            return [];
        }
        switch (this.operation) {
            case Transaction.CREATE:
                this.assetId = this._id;
                break;
            case Transaction.TRANSFER:
                this.assetId = this.asset.id;
                break;
            default:
                throw new TypeError('invalid transaction type, something wrong with the class implementation');
        }
        if (_.isUndefined(this.assetId || _.isUndefined(this._id))) {
            return [];
        }
        return _.map(this.outputs, (output, output_index) => ({
            transaction_id: this._id,
            output_index: output_index,
            amount: output.amount,
            asset_id: this.assetId,
            condition_uri: output.fulfillment.getConditionUri(),
        }));
    }
    getSpentOutputs() {
        if (_.isUndefined(this.inputs)) {
            return [];
        }
        return _.chain(this.inputs)
            .map((input) => { var _a; return (_a = input === null || input === void 0 ? void 0 : input.fulfills) === null || _a === void 0 ? void 0 : _a.toDict(); })
            .filter((input) => !_.isUndefined(input))
            .value();
    }
    serialized() {
        return Transaction._toStr(this.toDict());
    }
    toDict() {
        return {
            inputs: _.chain(this.inputs)
                .map((input) => input.toDict())
                .filter((input) => !_.isUndefined(input))
                .value(),
            outputs: _.map(this.outputs, (output) => output.toDict()),
            operation: this.operation,
            metadata: this.metadata,
            asset: this.asset,
            version: this.version,
            id: this._id,
        };
    }
    static _toStr(value) {
        return commonUtils_1.DataUtils.serialize(value);
    }
    static create(tx_signers, recipients, createConfig) {
        const [isValidCreate, err] = transactionHelper_2.TransactionInterfaceParamValidation.isValidCreateTransaction(tx_signers, recipients);
        if (!isValidCreate) {
            return [undefined, err];
        }
        const outputs = _.map(recipients, ([publicKeys, amount]) => Output.generate(publicKeys, amount));
        const inputs = [Input.generate(tx_signers)];
        let transactionInstance;
        try {
            transactionInstance = new Transaction(Transaction.CREATE, { data: createConfig === null || createConfig === void 0 ? void 0 : createConfig.asset }, { inputs, outputs, metadata: createConfig === null || createConfig === void 0 ? void 0 : createConfig.metadata });
        }
        catch (err) {
            return [undefined, err];
        }
        return [transactionInstance, undefined];
    }
    static transfer(inputs, recipients, asset_id, transferConfig) {
        const [isValidCall, err] = transactionHelper_2.TransactionInterfaceParamValidation.isValidTransferTransaction(inputs, recipients);
        if (!isValidCall) {
            return [undefined, err];
        }
        const outputs = _.map(recipients, ([publicKeys, amount]) => Output.generate(publicKeys, amount));
        const deepInputCopy = _.cloneDeep(inputs);
        let transferTransaction;
        try {
            transferTransaction = new Transaction(Transaction.TRANSFER, { id: asset_id }, {
                inputs: deepInputCopy,
                outputs,
                metadata: transferConfig === null || transferConfig === void 0 ? void 0 : transferConfig.metadata,
            });
        }
        catch (err) {
            return [undefined, err];
        }
        return [transferTransaction, undefined];
    }
    isEqual(other) {
        let otherSerializable;
        let thisSerializable;
        try {
            otherSerializable = other.toDict();
            thisSerializable = this.toDict();
        }
        catch (err) {
            return false;
        }
        if (!_.isUndefined(otherSerializable) ||
            !_.isUndefined(thisSerializable)) {
            return false;
        }
        return true;
    }
    toInputs(indices) {
        if (!_.isUndefined(indices)) {
            if (indices.length == 0) {
                throw new errors_1.ValueError('length cannot be 0');
            }
            const max = _.max(indices);
            const min = _.min(indices);
            if (max >= this.outputs.length) {
                throw new errors_1.ValueError('max value of indices >= len of outputs');
            }
            if (min < 0) {
                throw new errors_1.ValueError('min value of the indices < 0');
            }
            return _.map(indices, (idx) => new Input(this.outputs[idx].fulfillment, this.outputs[idx].public_keys, {
                fulfills: new TransactionLink({
                    txid: this.id,
                    output: idx,
                }),
            }));
        }
        return _.map(this.outputs, (output, idx) => new Input(output.fulfillment, output.public_keys, {
            fulfills: new TransactionLink({
                txid: this.id,
                output: idx,
            }),
        }));
    }
    get id() {
        return this._id;
    }
    addOutput(output) {
        this.outputs.push(output);
    }
    addInput(input) {
        this.inputs.push(input);
    }
    sign(privateKeys) {
        const keypairs = {};
        for (const privateKey of privateKeys) {
            keypairs[Transaction.genPublicKey(privateKey)] = privateKey;
        }
        const txDict = this.toDict();
        const txDictWithoutSignatures = Transaction._removeSignatures(txDict);
        const txSerialized = Transaction._toStr(txDictWithoutSignatures);
        for (let input of this.inputs) {
            input = this._signInput(input, txSerialized, keypairs);
        }
        this._hash();
        return this;
    }
    static genPublicKey(privateKey) {
        const curve = new elliptic.eddsa('ed25519');
        return curve.keyFromSecret(privateKey).getPublic('hex');
    }
    static _removeSignatures(txDict) {
        const txDictCopy = _.cloneDeep(txDict);
        for (const input of txDictCopy['inputs']) {
            input.fulfillment = undefined;
        }
        return txDictCopy;
    }
    _signInput(input, message, keyPairs) {
        if (input.fulfillment instanceof crypto_conditions_1.Ed25519Sha256) {
            return Transaction.signSimpleSignatureFulfillment(input, message, keyPairs);
        }
        if (input.fulfillment instanceof crypto_conditions_1.ThresholdSha256) {
            return Transaction.signThresholdSignatureFulfillment(input, message, keyPairs);
        }
        throw new errors_1.ValueError('invalid condition');
    }
    static signSimpleSignatureFulfillment(input, message, keyPairs) {
        const publicKey = input.owners_before[0];
        if (_.isUndefined(keyPairs[publicKey])) {
            throw new errors_1.KeypairMismatchError('public key');
        }
        const inputCopy = _.cloneDeep(input);
        let hashedMessage = CryptoJS.createHash('sha3-256')
            .update(message)
            .digest('hex');
        const { txid, output } = inputCopy.fulfills;
        hashedMessage = CryptoJS.createHash('sha3-256')
            .update(`${hashedMessage}${txid}${output}`)
            .digest('hex');
        inputCopy.fulfillment.sign(Buffer.from(hashedMessage), Buffer.from(keyPairs[publicKey]));
        return inputCopy;
    }
    // work on
    static signThresholdSignatureFulfillment(input, message, keyPairs) {
        const inputCopy = _.cloneDeep(input);
        let hashedMessage = CryptoJS.createHash('sha3-256')
            .update(message)
            .digest('hex');
        const { txid, output } = inputCopy.fulfills;
        hashedMessage = CryptoJS.createHash('sha3-256')
            .update(`${hashedMessage}${txid}${output}`)
            .digest('hex');
        for (const owner_before of new Set(inputCopy.owners_before)) {
            const subfulfills = Transaction.getSubconditionFromVerifyingKey(owner_before, input.fulfillment);
            if (subfulfills.length == 0) {
                throw new errors_1.KeypairMismatchError(`Public key ${owner_before} cannot be found`);
            }
            const privateKey = keyPairs[owner_before];
            if (!privateKey) {
                throw new errors_1.KeypairMismatchError(`public key ${owner_before} is not a key pair`);
            }
            for (let sub of subfulfills) {
                sub.sign(Buffer.from(message), Buffer.from(privateKey));
            }
        }
        return inputCopy;
    }
    static getSubconditionFromVerifyingKey(key, fulfillment) {
        let conditions = [];
        const subfulfillments = transactionHelper_1.FulfillmentHelpers.getAsn1JsonValue(fulfillment).subfulfillments;
        for (const sub of subfulfillments) {
            if (sub.type === crypto_conditions_2.Types.Ed25519Sha256) {
                if (sub.publicKey != key) {
                    continue;
                }
                conditions.push(crypto_conditions_1.Fulfillment.fromJson(sub));
                continue;
            }
            if (sub.type === crypto_conditions_2.Types.ThresholdSha256) {
                const result = Transaction.getSubconditionFromVerifyingKey(key, crypto_conditions_1.Fulfillment.fromJson(sub));
                if (result.length > 0) {
                    conditions = _.concat(conditions, result);
                }
            }
        }
        return conditions;
    }
    inputsValid(outputs) {
        switch (this.operation) {
            case Transaction.CREATE:
                return this._inputsValid(new Array(this.inputs.length).fill('dummyvalue'));
            case Transaction.TRANSFER:
                return this._inputsValid(_.map(outputs, (output) => output.fulfillment.getConditionUri()));
            default:
                throw new errors_1.ValueError('invalid operation');
        }
    }
    _inputsValid(outputConditionUris = []) {
        if (this.inputs.length !== outputConditionUris.length) {
            throw new errors_1.ValueError('inputs and output conditons must have the same length');
        }
        let txDict = this.toDict();
        txDict = Transaction._removeSignatures(txDict);
        txDict[this.id] = undefined;
        const txSerialized = Transaction._toStr(txDict);
        return _.chain(outputConditionUris)
            .map((outputConditionUri, idx) => this.validate(this.inputs[idx], this.operation, txSerialized, idx, outputConditionUri))
            .every((cond) => cond)
            .value();
    }
    validate(input, operation, txSerialized, idx, outputConditionUri) {
        return Transaction._inputValid(input, operation, txSerialized, idx, outputConditionUri);
    }
    static _inputValid(input, operation, message, idx, outputConditionUri) {
        const ccfill = input.fulfillment;
        let parsedFulfillment;
        try {
            parsedFulfillment = crypto_conditions_1.Fulfillment.fromUri(ccfill.serializeUri());
        }
        catch (err) {
            logger_1.default.error('parsedFulfillment conversion not possible', { err });
            return false;
        }
        let isOutputValid = false;
        if (operation == Transaction.CREATE) {
            isOutputValid = true;
        }
        else {
            isOutputValid = outputConditionUri === ccfill.getConditionUri();
        }
        let hashedMessage = CryptoJS.createHash('sha3-256')
            .update(message)
            .digest('hex');
        const { txid, output } = input.fulfills;
        hashedMessage = CryptoJS.createHash('sha3-256')
            .update(`${hashedMessage}${txid}${output}`)
            .digest('hex');
        const isFulfillmentValid = parsedFulfillment.validate(Buffer.from(hashedMessage));
        return isOutputValid && isFulfillmentValid;
    }
    to_hash() {
        return this.toDict()['id'];
    }
    _hash() {
        this._id = index_1.Crypto.hashData(this.serialized());
    }
    // TODO: this method shouldn't call `_removeSignatures`
    toString() {
        const tx = Transaction._removeSignatures(this.toDict());
        return Transaction._toStr(tx);
    }
    static getAssetId(transactions) {
        if (transactions.length == 0) {
            throw new errors_1.ValueError('transactions cannot be empty');
        }
        const assetIds = new Set();
        for (const transaction of transactions) {
            if (transaction.operation === Transaction.CREATE) {
                assetIds.add(transaction._id);
                continue;
            }
            assetIds.add(transaction.asset['id']);
        }
        if (assetIds.size > 1) {
            throw new errors_1.AssetIdMismatchError('assetIds.length', 'there should only be one asset');
        }
        return assetIds[0];
    }
    static _to_hash(value) {
        return index_1.Crypto.hashData(value);
    }
    static validateId(txBody) {
        const txBodyCopy = _.cloneDeep(txBody);
        if (_.isUndefined(txBodyCopy['id'])) {
            throw new errors_1.InvalidHashError("txBody['id']", 'No transaction id found!');
        }
        const proposedTxId = txBody.id;
        txBodyCopy.id = undefined;
        const txBodySerialized = Transaction._toStr(txBodyCopy);
        const validTxId = Transaction._to_hash(txBodySerialized);
        if (proposedTxId !== validTxId) {
            throw new errors_1.InvalidHashError('proposedTxId', 'proposedTxId is not equal to validTxId');
        }
    }
    static fromDict(tx, skipSchemaValidation = true) {
        const inputs = _.map(tx.inputs, (txInput) => Input.fromDict(txInput));
        const outputs = _.map(tx.outputs, (txOutput) => Output.fromDict(txOutput)[0]);
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
    static fromDb(resdb, // ResDB validator
    txDictList) {
        let shouldReturnList = true;
        if (!Array.isArray(txDictList)) {
            txDictList = [txDictList];
            shouldReturnList = false;
        }
        const txMap = {};
        const txIds = [];
        for (let tx of txDictList) {
            tx.metadata = undefined;
            txMap[tx.id] = tx;
            txIds.push(tx.id);
        }
        const assets = _.toArray(resdb.get_assets(txIds)); // CHANGE; VALIDATION NEEDED
        for (let asset of assets) {
            if (!asset) {
                continue;
            }
            let tx = txMap[asset.id]; // change when there is more context
            delete asset['id'];
            tx['asset'] = asset;
        }
        const txIdsList = _.toArray(Object.keys(txMap));
        const metadataList = _.toArray(resdb.get_metadata(txIdsList)); // THIS NEEDS TO BE CHANGED
        for (let metadata of metadataList) {
            let tx = txMap[metadata.id]; //change when there is more context
            tx.metadata = metadata === null || metadata === void 0 ? void 0 : metadata.metadata;
        }
        if (shouldReturnList) {
            const txList = []; //change when there is more context
            for (const [txId, tx] of Object.entries(txMap)) {
                txList.push(Transaction.fromDict(tx)); // check context
            }
            return txList;
        }
        return Transaction.fromDict(Object.values(txMap)[0]);
    }
    // more context is needed for these functions use `any for now`
    static registerType(txType, txClass) {
        Transaction.typeRegistry[txType] = txClass;
    }
    resolveClass(operation) {
        // more context is needed for this return type
        const createTxnClass = Transaction.typeRegistry[Transaction.CREATE]; // more context needed for type
        return Transaction.typeRegistry[operation] || createTxnClass;
    }
    static validateSchema(tx) {
        /**
         * NOT IMPLEMENTED
         * TODO
         */
    }
}
exports.Transaction = Transaction;
Transaction.CREATE = 'CREATE';
Transaction.TRANSFER = 'TRANSFER';
Transaction.ALLOWED_OPERATIONS = new Set([
    Transaction.CREATE,
    Transaction.TRANSFER,
]);
Transaction.DEFAULT_VERSION = '2.0';
Transaction.typeRegistry = {}; // more context needed;

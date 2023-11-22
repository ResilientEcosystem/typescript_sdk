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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionInterfaceParamValidation = exports.FulfillmentFromDetailsHelper = exports.FulfillmentToDetailsHelper = exports.FulfillmentHelpers = void 0;
const bs58_1 = __importDefault(require("bs58"));
const lodash_1 = __importDefault(require("lodash"));
const crypto_conditions_1 = require("crypto-conditions");
const errors_1 = require("../utils/errors");
/**
 * @namespace FulfillmentHelpers
 * @function getAsn1JsonValue
 */
var FulfillmentHelpers;
(function (FulfillmentHelpers) {
    /**
     * @function getAsn1JsonValue
     * @type {T extends TypeAsn1Fulfillment}
     * @param {Fulfillment} fulfillment
     * @returns {FulfillmentAsn1JsonValueMap[T]} - returns the json corresponding to the template type
     */
    function getAsn1JsonValue(fulfillment) {
        return fulfillment.getAsn1Json().value;
    }
    FulfillmentHelpers.getAsn1JsonValue = getAsn1JsonValue;
})(FulfillmentHelpers || (exports.FulfillmentHelpers = FulfillmentHelpers = {}));
/**
 * @namespace FulfillmentToDetailsHelper
 * @function ed25519Sha256FulfillmentDetailsHandler
 * @function thresholdSha256FulfillmentDetailsHandler
 * @function fulfillmentToDetailsHandler
 * @exports fulfillmentToDetailsHandler
 */
var FulfillmentToDetailsHelper;
(function (FulfillmentToDetailsHelper) {
    /**
     * @function ed25519Sha256FulfillmentDetailsHandler
     * @param {Fulfillment} fulfillment
     * @returns {Ed25519Sha256FulfillmentDetails}
     */
    function ed25519Sha256FulfillmentDetailsHandler(fulfillment) {
        return {
            type: crypto_conditions_1.TypeName.Ed25519Sha256,
            public_key: bs58_1.default.encode(Buffer.from(FulfillmentHelpers.getAsn1JsonValue(fulfillment).publicKey)),
        };
    }
    /**
     * @function thresholdSha256FulfillmentDetailsHandler
     * @param {Fulfillment} fulfillment
     * @returns {ThresholdSha256FulfillmentDetails}
     */
    function thresholdSha256FulfillmentDetailsHandler(fulfillment) {
        const { subconditions, subfulfillments, threshold, } = FulfillmentHelpers.getAsn1JsonValue(fulfillment);
        return {
            type: crypto_conditions_1.TypeName.ThresholdSha256,
            threshold,
            subfulfillments,
            subconditions,
        };
    }
    /**
     * @function fulfillmentToDetailsHandler
     * @param {Fulfillment} fulfillment
     * @returns {[FulfillmentDetails | undefined, Error | undefined]} - Returns an error caught value.
     * - If error, return [undefined, err], else return [FulfillmentDetails, undefined]
     */
    function fulfillmentToDetailsHandler(fulfillment) {
        switch (fulfillment.getTypeName()) {
            case crypto_conditions_1.TypeName.Ed25519Sha256:
                return [
                    ed25519Sha256FulfillmentDetailsHandler(fulfillment),
                    undefined,
                ];
            case crypto_conditions_1.TypeName.ThresholdSha256:
                return [
                    thresholdSha256FulfillmentDetailsHandler(fulfillment),
                    undefined,
                ];
            default:
                return [
                    undefined,
                    new errors_1.TypeNotSupportedError('FulfillmentDetailsHandler', fulfillment.getTypeName()),
                ];
        }
    }
    FulfillmentToDetailsHelper.fulfillmentToDetailsHandler = fulfillmentToDetailsHandler;
})(FulfillmentToDetailsHelper || (exports.FulfillmentToDetailsHelper = FulfillmentToDetailsHelper = {}));
/**
 * @namespace FulfillmentFromDetailsHelper
 * @function ed25519Sha256FulfillmentDetailsHandler
 * @function thresholdSha256FulfillmentDetailsHandler
 * @function recursivelyBuildSubFulfillments
 * @function fulfillmentFromDetailsHandler
 * @exports fulfillmentFromDetailsHandler
 */
var FulfillmentFromDetailsHelper;
(function (FulfillmentFromDetailsHelper) {
    /**
     * @function ed25519Sha256FulfillmentDetailsHandler
     * @param {Ed25519Sha256FulfillmentDetails} data
     * @param {number} _depth - Recursive iterations
     * @returns {[Fulfillment | undefined, Error | undefined]} - Function catches the error
     * Convert the Ed25519ShaFulfillmentDetails to a Ed25519Sha256
     */
    function ed25519Sha256FulfillmentDetailsHandler(data, _depth = 0) {
        if (_depth >= 100) {
            return [undefined, new errors_1.ThresholdTooDeep('transaction')];
        }
        try {
            const ed255 = new crypto_conditions_1.Ed25519Sha256();
            ed255.setPublicKey(Buffer.from(data.public_key));
            return [ed255, undefined];
        }
        catch (err) {
            return [undefined, err];
        }
    }
    /**
     * @function thresholdSha256FulfillmentDetailsHandler
     * @param {ThresholdSha256FulfillmentDetails} data
     * @param {number} _depth - Recursive iterations
     * @returns {[FulfiThresholdSha256llment | undefined, Error | undefined]} - Function catches the error
     * Convert the ThresholdSha256FulfillmentDetails to a ThresholdSha256
     */
    function thresholdSha256FulfillmentDetailsHandler(data, _depth = 0) {
        if (_depth >= 100) {
            return [undefined, new errors_1.ThresholdTooDeep('transaction')];
        }
        try {
            const threshold = new crypto_conditions_1.ThresholdSha256();
            threshold.setThreshold(data.threshold);
            const subfullObj = recursivelyBuildSubFulfillments(data.subfulfillments, _depth + 1);
            if (!lodash_1.default.isUndefined(subfullObj)) {
                threshold.addSubfulfillment(subfullObj);
            }
            return [threshold, undefined];
        }
        catch (err) {
            return [undefined, err];
        }
    }
    /**
     * @function recursivelyBuildSubFulfillments
     * @param {(PreimageSha256Json | PrefixSha256Json | ThresholdSha256Json | RsaSha256Json | Ed25519Sha256Json)[] | undefined} subfulfillments
     * @param {number} _depth - Recursive iterations
     * @returns {Fulfillment | undefined} - Returns a Fulfillment with subfulfillments recursively populated
     */
    function recursivelyBuildSubFulfillments(subfulfillments, _depth = 0) {
        if (!subfulfillments || _depth >= 100)
            return undefined;
        const thresholdSha = new crypto_conditions_1.ThresholdSha256();
        const subfillmentObj = lodash_1.default.map(subfulfillments, (subfulfillment) => FulfillmentFromDetailsHelper.fulfillmentFromDetailsHandler(subfulfillment, _depth + 1)[0]);
        for (const subfulfillment of subfillmentObj) {
            if (lodash_1.default.isUndefined(subfulfillment))
                continue;
            thresholdSha.addSubfulfillment(subfulfillment);
        }
        return thresholdSha;
    }
    /**
     * @function fulfillmentFromDetailsHandler
     * @param {FulfillmentDetails} data
     * @param {number} depth
     * @returns {[Fulfillment | undefined, Error | undefined]} - Returns Fulfillment after using data to construct
     * - Error is caught in the function
     * - Check for the error after using
     */
    function fulfillmentFromDetailsHandler(data, depth = 0) {
        if (depth >= 100) {
            return [undefined, new errors_1.ThresholdTooDeep('fulfillmentFromDetails')];
        }
        switch (data.type) {
            case crypto_conditions_1.TypeName.Ed25519Sha256:
                return ed25519Sha256FulfillmentDetailsHandler(data);
            case crypto_conditions_1.TypeName.ThresholdSha256:
                return thresholdSha256FulfillmentDetailsHandler(data);
            default:
                return [
                    undefined,
                    new errors_1.TypeNotSupportedError('FulfillmentDetailsHandler', data.type),
                ];
        }
    }
    FulfillmentFromDetailsHelper.fulfillmentFromDetailsHandler = fulfillmentFromDetailsHandler;
})(FulfillmentFromDetailsHelper || (exports.FulfillmentFromDetailsHelper = FulfillmentFromDetailsHelper = {}));
/**
 * @namespace TransactionInterfaceParamValidation
 * @function isValidConstructorCreateTransaction
 * @function isValidConstructorTransferTransaction
 * @function isValidCreateTransaction
 * @function isValidTransferTransaction
 */
var TransactionInterfaceParamValidation;
(function (TransactionInterfaceParamValidation) {
    /**
     * @function isValidConstructorCreateTransaction
     * @param {CreateAsset | undefined} asset
     * @returns {boolean} - Boolean return values refer to valid values for instance creation using Transaction.CREATE
     */
    function isValidConstructorCreateTransaction(asset) {
        if (lodash_1.default.isUndefined(asset)) {
            return true;
        }
        if (!lodash_1.default.isUndefined(asset.data)) {
            return true;
        }
        return false;
    }
    TransactionInterfaceParamValidation.isValidConstructorCreateTransaction = isValidConstructorCreateTransaction;
    /**
     * @function isValidConstructorTransferTransaction
     * @param {TransferAsset | undefined} asset
     * @returns {boolean} - Boolean return values refer to valid values for instance creation using Transaction.TRANSFER
     */
    function isValidConstructorTransferTransaction(asset) {
        if (!lodash_1.default.isUndefined(asset === null || asset === void 0 ? void 0 : asset.id)) {
            return true;
        }
        return false;
    }
    TransactionInterfaceParamValidation.isValidConstructorTransferTransaction = isValidConstructorTransferTransaction;
    /**
     * @function isValidCreateTransaction
     * @param {string[]} tx_signers
     * @param {Recipient[]} recipients
     * @returns {[boolean, Error | undefined]} - Returns boolean and error
     * - If errors, return [false, err], else return [true, undefined]
     */
    function isValidCreateTransaction(tx_signers, recipients) {
        if (tx_signers.length <= 0) {
            return [false, new errors_1.ValueError('tx_signers cannot be nonpositive')];
        }
        if (recipients.length <= 0) {
            return [false, new errors_1.ValueError('recipients cannot be of len 0')];
        }
        return [true, undefined];
    }
    TransactionInterfaceParamValidation.isValidCreateTransaction = isValidCreateTransaction;
    /**
     * @function isValidTransferTransaction
     * @param {Input[]} inputs
     * @param {Recipient[]} recipients
     * @returns {[boolean, Error | undefined]} - Returns boolean and error
     * - If errors, return [false, err], else return [true, undefined]
     */
    function isValidTransferTransaction(inputs, recipients) {
        if (inputs.length <= 0) {
            return [false, new errors_1.ValueError('inputs cannot be nonpositive')];
        }
        if (recipients.length <= 0) {
            return [false, new errors_1.ValueError('recipients cannot be nonpositive')];
        }
        return [true, undefined];
    }
    TransactionInterfaceParamValidation.isValidTransferTransaction = isValidTransferTransaction;
})(TransactionInterfaceParamValidation || (exports.TransactionInterfaceParamValidation = TransactionInterfaceParamValidation = {}));

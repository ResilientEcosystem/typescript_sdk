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

import base58 from 'bs58';
import _ from 'lodash';

import {
    Fulfillment,
    TypeName,
    TypeAsn1Fulfillment,
    Ed25519Sha256,
    ThresholdSha256,
} from 'crypto-conditions';

import {
    TypeNotSupportedError,
    ThresholdTooDeep,
    ValueError,
} from '../utils/errors';

import type { FulfillmentAsn1JsonValueMap } from 'crypto-conditions/types/lib/fulfillment';
import type {
    Ed25519Sha256FulfillmentDetails,
    ThresholdSha256FulfillmentDetails,
    FulfillmentDetails,
    CreateAsset,
    TransferAsset,
    Recipient,
} from './interface';

import type {
    Ed25519Sha256Json,
    PrefixSha256Json,
    PreimageSha256Json,
    RsaSha256Json,
    ThresholdSha256Json,
} from 'crypto-conditions/types/types';

import type { Input } from './';

/**
 * @namespace FulfillmentHelpers
 * @function getAsn1JsonValue
 */
export namespace FulfillmentHelpers {
    /**
     * @function getAsn1JsonValue
     * @type {T extends TypeAsn1Fulfillment}
     * @param {Fulfillment} fulfillment
     * @returns {FulfillmentAsn1JsonValueMap[T]} - returns the json corresponding to the template type
     */
    export function getAsn1JsonValue<T extends TypeAsn1Fulfillment>(
        fulfillment: Fulfillment
    ): FulfillmentAsn1JsonValueMap[T] {
        return fulfillment.getAsn1Json<T>().value;
    }
}

/**
 * @namespace FulfillmentToDetailsHelper
 * @function ed25519Sha256FulfillmentDetailsHandler
 * @function thresholdSha256FulfillmentDetailsHandler
 * @function fulfillmentToDetailsHandler
 * @exports fulfillmentToDetailsHandler
 */
export namespace FulfillmentToDetailsHelper {
    /**
     * @function ed25519Sha256FulfillmentDetailsHandler
     * @param {Fulfillment} fulfillment
     * @returns {Ed25519Sha256FulfillmentDetails}
     */
    function ed25519Sha256FulfillmentDetailsHandler(
        fulfillment: Fulfillment
    ): Ed25519Sha256FulfillmentDetails {
        return {
            type: TypeName.Ed25519Sha256,
            public_key: base58.encode(
                Buffer.from(
                    FulfillmentHelpers.getAsn1JsonValue<TypeAsn1Fulfillment.Ed25519Sha256>(
                        fulfillment
                    ).publicKey
                )
            ),
        };
    }

    /**
     * @function thresholdSha256FulfillmentDetailsHandler
     * @param {Fulfillment} fulfillment
     * @returns {ThresholdSha256FulfillmentDetails}
     */
    function thresholdSha256FulfillmentDetailsHandler(
        fulfillment: Fulfillment
    ): ThresholdSha256FulfillmentDetails {
        const {
            subconditions,
            subfulfillments,
            threshold,
        }: FulfillmentAsn1JsonValueMap[TypeAsn1Fulfillment.ThresholdSha256] =
            FulfillmentHelpers.getAsn1JsonValue<TypeAsn1Fulfillment.ThresholdSha256>(
                fulfillment
            );

        return {
            type: TypeName.ThresholdSha256,
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
    export function fulfillmentToDetailsHandler(
        fulfillment: Fulfillment
    ): [FulfillmentDetails | undefined, Error | undefined] {
        switch (fulfillment.getTypeName()) {
            case TypeName.Ed25519Sha256:
                return [
                    ed25519Sha256FulfillmentDetailsHandler(
                        fulfillment as Ed25519Sha256
                    ),
                    undefined,
                ];
            case TypeName.ThresholdSha256:
                return [
                    thresholdSha256FulfillmentDetailsHandler(
                        fulfillment as ThresholdSha256
                    ),
                    undefined,
                ];
            default:
                return [
                    undefined,
                    new TypeNotSupportedError(
                        'FulfillmentDetailsHandler',
                        fulfillment.getTypeName()
                    ),
                ];
        }
    }
}
/**
 * @namespace FulfillmentFromDetailsHelper
 * @function ed25519Sha256FulfillmentDetailsHandler
 * @function thresholdSha256FulfillmentDetailsHandler
 * @function recursivelyBuildSubFulfillments
 * @function fulfillmentFromDetailsHandler
 * @exports fulfillmentFromDetailsHandler
 */
export namespace FulfillmentFromDetailsHelper {
    /**
     * @function ed25519Sha256FulfillmentDetailsHandler
     * @param {Ed25519Sha256FulfillmentDetails} data
     * @param {number} _depth - Recursive iterations
     * @returns {[Fulfillment | undefined, Error | undefined]} - Function catches the error
     * Convert the Ed25519ShaFulfillmentDetails to a Ed25519Sha256
     */
    function ed25519Sha256FulfillmentDetailsHandler(
        data: Ed25519Sha256FulfillmentDetails,
        _depth: number = 0
    ): [Ed25519Sha256 | undefined, Error | undefined] {
        if (_depth >= 100) {
            return [undefined, new ThresholdTooDeep('transaction')];
        }
        try {
            const ed255: Ed25519Sha256 = new Ed25519Sha256();
            ed255.setPublicKey(Buffer.from(data.public_key));
            return [ed255, undefined];
        } catch (err) {
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
    function thresholdSha256FulfillmentDetailsHandler(
        data: ThresholdSha256FulfillmentDetails,
        _depth: number = 0
    ): [ThresholdSha256 | undefined, Error | undefined] {
        if (_depth >= 100) {
            return [undefined, new ThresholdTooDeep('transaction')];
        }
        try {
            const threshold: ThresholdSha256 = new ThresholdSha256();
            threshold.setThreshold(data.threshold);

            const subfullObj: Fulfillment | undefined =
                recursivelyBuildSubFulfillments(
                    data.subfulfillments,
                    _depth + 1
                );

            if (!_.isUndefined(subfullObj)) {
                threshold.addSubfulfillment(subfullObj);
            }
            return [threshold, undefined];
        } catch (err) {
            return [undefined, err];
        }
    }

    /**
     * @function recursivelyBuildSubFulfillments
     * @param {(PreimageSha256Json | PrefixSha256Json | ThresholdSha256Json | RsaSha256Json | Ed25519Sha256Json)[] | undefined} subfulfillments
     * @param {number} _depth - Recursive iterations
     * @returns {Fulfillment | undefined} - Returns a Fulfillment with subfulfillments recursively populated
     */
    function recursivelyBuildSubFulfillments(
        subfulfillments:
            | (
                  | PreimageSha256Json
                  | PrefixSha256Json
                  | ThresholdSha256Json
                  | RsaSha256Json
                  | Ed25519Sha256Json
              )[]
            | undefined,
        _depth: number = 0
    ): Fulfillment | undefined {
        if (!subfulfillments || _depth >= 100) return undefined;
        const thresholdSha: ThresholdSha256 = new ThresholdSha256();
        const subfillmentObj: (Fulfillment | undefined)[] = _.map(
            subfulfillments,
            (subfulfillment) =>
                FulfillmentFromDetailsHelper.fulfillmentFromDetailsHandler(
                    subfulfillment,
                    _depth + 1
                )[0]
        );
        for (const subfulfillment of subfillmentObj) {
            if (_.isUndefined(subfulfillment)) continue;
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
    export function fulfillmentFromDetailsHandler(
        data: FulfillmentDetails,
        depth: number = 0
    ): [Fulfillment | undefined, Error | undefined] {
        if (depth >= 100) {
            return [undefined, new ThresholdTooDeep('fulfillmentFromDetails')];
        }
        switch (data.type) {
            case TypeName.Ed25519Sha256:
                return ed25519Sha256FulfillmentDetailsHandler(
                    data as Ed25519Sha256FulfillmentDetails
                );
            case TypeName.ThresholdSha256:
                return thresholdSha256FulfillmentDetailsHandler(
                    data as ThresholdSha256FulfillmentDetails
                );
            default:
                return [
                    undefined,
                    new TypeNotSupportedError(
                        'FulfillmentDetailsHandler',
                        data.type
                    ),
                ];
        }
    }
}
/**
 * @namespace TransactionInterfaceParamValidation
 * @function isValidConstructorCreateTransaction
 * @function isValidConstructorTransferTransaction
 * @function isValidCreateTransaction
 * @function isValidTransferTransaction
 */
export namespace TransactionInterfaceParamValidation {
    /**
     * @function isValidConstructorCreateTransaction
     * @param {CreateAsset | undefined} asset
     * @returns {boolean} - Boolean return values refer to valid values for instance creation using Transaction.CREATE
     */
    export function isValidConstructorCreateTransaction(
        asset: CreateAsset | undefined
    ) {
        if (_.isUndefined(asset)) {
            return true;
        }
        if (!_.isUndefined(asset.data)) {
            return true;
        }
        return false;
    }

    /**
     * @function isValidConstructorTransferTransaction
     * @param {TransferAsset | undefined} asset
     * @returns {boolean} - Boolean return values refer to valid values for instance creation using Transaction.TRANSFER
     */
    export function isValidConstructorTransferTransaction(
        asset: TransferAsset | undefined
    ) {
        if (!_.isUndefined(asset?.id)) {
            return true;
        }
        return false;
    }

    /**
     * @function isValidCreateTransaction
     * @param {string[]} tx_signers
     * @param {Recipient[]} recipients
     * @returns {[boolean, Error | undefined]} - Returns boolean and error
     * - If errors, return [false, err], else return [true, undefined]
     */
    export function isValidCreateTransaction(
        tx_signers: string[],
        recipients: Recipient[]
    ): [boolean, Error | undefined] {
        if (tx_signers.length <= 0) {
            return [false, new ValueError('tx_signers cannot be nonpositive')];
        }
        if (recipients.length <= 0) {
            return [false, new ValueError('recipients cannot be of len 0')];
        }
        return [true, undefined];
    }

    /**
     * @function isValidTransferTransaction
     * @param {Input[]} inputs
     * @param {Recipient[]} recipients
     * @returns {[boolean, Error | undefined]} - Returns boolean and error
     * - If errors, return [false, err], else return [true, undefined]
     */
    export function isValidTransferTransaction(
        inputs: Input[],
        recipients: Recipient[]
    ): [boolean | undefined, Error | undefined] {
        if (inputs.length <= 0) {
            return [false, new ValueError('inputs cannot be nonpositive')];
        }
        if (recipients.length <= 0) {
            return [false, new ValueError('recipients cannot be nonpositive')];
        }
        return [true, undefined];
    }
}

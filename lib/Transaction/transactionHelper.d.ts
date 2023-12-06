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
import { Fulfillment, TypeAsn1Fulfillment } from 'crypto-conditions';
import type { FulfillmentAsn1JsonValueMap } from 'crypto-conditions/types/lib/fulfillment';
import type { FulfillmentDetails, CreateAsset, TransferAsset, Recipient } from './interface';
import type { Input } from './';
/**
 * @namespace FulfillmentHelpers
 * @function getAsn1JsonValue
 */
export declare namespace FulfillmentHelpers {
    /**
     * @function getAsn1JsonValue
     * @type {T extends TypeAsn1Fulfillment}
     * @param {Fulfillment} fulfillment
     * @returns {FulfillmentAsn1JsonValueMap[T]} - returns the json corresponding to the template type
     */
    function getAsn1JsonValue<T extends TypeAsn1Fulfillment>(fulfillment: Fulfillment): FulfillmentAsn1JsonValueMap[T];
}
/**
 * @namespace FulfillmentToDetailsHelper
 * @function ed25519Sha256FulfillmentDetailsHandler
 * @function thresholdSha256FulfillmentDetailsHandler
 * @function fulfillmentToDetailsHandler
 * @exports fulfillmentToDetailsHandler
 */
export declare namespace FulfillmentToDetailsHelper {
    /**
     * @function fulfillmentToDetailsHandler
     * @param {Fulfillment} fulfillment
     * @returns {[FulfillmentDetails | undefined, Error | undefined]} - Returns an error caught value.
     * - If error, return [undefined, err], else return [FulfillmentDetails, undefined]
     */
    function fulfillmentToDetailsHandler(fulfillment: Fulfillment): [FulfillmentDetails | undefined, Error | undefined];
}
/**
 * @namespace FulfillmentFromDetailsHelper
 * @function ed25519Sha256FulfillmentDetailsHandler
 * @function thresholdSha256FulfillmentDetailsHandler
 * @function recursivelyBuildSubFulfillments
 * @function fulfillmentFromDetailsHandler
 * @exports fulfillmentFromDetailsHandler
 */
export declare namespace FulfillmentFromDetailsHelper {
    /**
     * @function fulfillmentFromDetailsHandler
     * @param {FulfillmentDetails} data
     * @param {number} depth
     * @returns {[Fulfillment | undefined, Error | undefined]} - Returns Fulfillment after using data to construct
     * - Error is caught in the function
     * - Check for the error after using
     */
    function fulfillmentFromDetailsHandler(data: FulfillmentDetails, depth?: number): [Fulfillment | undefined, Error | undefined];
}
/**
 * @namespace TransactionInterfaceParamValidation
 * @function isValidConstructorCreateTransaction
 * @function isValidConstructorTransferTransaction
 * @function isValidCreateTransaction
 * @function isValidTransferTransaction
 */
export declare namespace TransactionInterfaceParamValidation {
    /**
     * @function isValidConstructorCreateTransaction
     * @param {CreateAsset | undefined} asset
     * @returns {boolean} - Boolean return values refer to valid values for instance creation using Transaction.CREATE
     */
    function isValidConstructorCreateTransaction(asset: CreateAsset | undefined): boolean;
    /**
     * @function isValidConstructorTransferTransaction
     * @param {TransferAsset | undefined} asset
     * @returns {boolean} - Boolean return values refer to valid values for instance creation using Transaction.TRANSFER
     */
    function isValidConstructorTransferTransaction(asset: TransferAsset | undefined): boolean;
    /**
     * @function isValidCreateTransaction
     * @param {string[]} tx_signers
     * @param {Recipient[]} recipients
     * @returns {[boolean, Error | undefined]} - Returns boolean and error
     * - If errors, return [false, err], else return [true, undefined]
     */
    function isValidCreateTransaction(tx_signers: string[], recipients: Recipient[]): [boolean, Error | undefined];
    /**
     * @function isValidTransferTransaction
     * @param {Input[]} inputs
     * @param {Recipient[]} recipients
     * @returns {[boolean, Error | undefined]} - Returns boolean and error
     * - If errors, return [false, err], else return [true, undefined]
     */
    function isValidTransferTransaction(inputs: Input[], recipients: Recipient[]): [boolean | undefined, Error | undefined];
}

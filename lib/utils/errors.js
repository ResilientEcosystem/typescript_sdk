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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSignature = exports.MissingPrivateKeyError = exports.TransactionFailed = exports.InputDoesNotExist = exports.InvalidHashError = exports.AssetIdMismatchError = exports.KeypairMismatchError = exports.ThresholdTooDeep = exports.TypeNotSupportedError = exports.TimeoutError = exports.ValueError = void 0;
/**
 * @class TimeoutError
 * @implements {ResilientDBError}
 * - Collects timeout errors
 */
class TimeoutError {
    constructor(origin, errorTrace) {
        this.name = 'TimeoutError';
        this.message = `Timeout Error in module ${origin}`;
        this.errorTrace = errorTrace;
    }
}
exports.TimeoutError = TimeoutError;
/**
 * @class TypeNotSupportedError
 * @implements {ResilientDBError}
 * - Thrown when an objects type is not was expected
 */
class TypeNotSupportedError {
    constructor(origin, unsupportedType) {
        this.name = 'TypeNotSupportedError';
        this.message = `TypeNotSupportedError in module ${origin}`;
        this.unsupportedType = unsupportedType;
    }
}
exports.TypeNotSupportedError = TypeNotSupportedError;
/**
 * @class ThresholdTooDeep
 * @implements {ResilientDBError}
 * - Thrown when recursive depth when recreating threshold subconditions is too deep
 */
class ThresholdTooDeep {
    constructor(origin) {
        this.name = 'ThresholdTooDeep';
        this.message = `ThresholdTooDeep in module ${origin}`;
    }
}
exports.ThresholdTooDeep = ThresholdTooDeep;
/**
 * @class ValueError
 * @implements {ResilientDBError}
 * - Thrown when the value was outside of what was expected
 */
class ValueError {
    constructor(variable) {
        this.name = 'ValueError';
        this.message = `ValueError because of variable: ${variable}`;
    }
}
exports.ValueError = ValueError;
/**
 * @class KeypairMismatchError
 * @implements {ResilientDBError}
 * - Thrown dictionary is missing a value corresponding to a given key
 */
class KeypairMismatchError {
    constructor(variable) {
        this.name = 'KeypairMismatchError';
        this.message = `KeypairMismatchError because of variable: ${variable}`;
    }
}
exports.KeypairMismatchError = KeypairMismatchError;
/**
 * @class AssetIdMismatchError
 * @implements {ResilientDBError}
 * - Thrown when multiple asset ids exist for a transaction
 */
class AssetIdMismatchError {
    constructor(variable, message) {
        this.name = 'AssetIdMismatchError';
        this.message = `AssetIdMismatchError because of variable: ${variable}
                        \n${message}`;
    }
}
exports.AssetIdMismatchError = AssetIdMismatchError;
/**
 * @class InvalidHashError
 * @implements {ResilientDBError}
 * - Thrown when the hash_id does not match with expected id
 */
class InvalidHashError {
    constructor(variable, message) {
        this.name = 'InvalidHashError';
        this.message = `InvalidHashError because of variable: ${variable}
                        \n${message}`;
    }
}
exports.InvalidHashError = InvalidHashError;
class InputDoesNotExist {
    constructor(message) {
        this.name = 'InputDoesNotExist';
        this.message = `InputDoesNotExis: ${message}`;
    }
}
exports.InputDoesNotExist = InputDoesNotExist;
class TransactionFailed {
    constructor(message) {
        this.name = 'TransactionFailed';
        this.message = `TransactionFailed: ${message}`;
    }
}
exports.TransactionFailed = TransactionFailed;
class MissingPrivateKeyError {
    constructor(message) {
        this.name = 'MissingPrivateKeyError';
        this.message = `MissingPrivateKeyError: ${message}`;
    }
}
exports.MissingPrivateKeyError = MissingPrivateKeyError;
class InvalidSignature {
    constructor(message) {
        this.name = 'InvalidSignature';
        this.message = `InvalidSignature: ${message}`;
    }
}
exports.InvalidSignature = InvalidSignature;

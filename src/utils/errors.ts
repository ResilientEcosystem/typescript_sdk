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

/**
 * @interface ResilientDBError
 * @extends Error
 * - Currently has not meaningful extensions
 * - Extends error for future functionality
 */
interface ResilientDBError extends Error {}

/**
 * @class TimeoutError
 * @implements {ResilientDBError}
 * - Collects timeout errors
 */
class TimeoutError implements ResilientDBError {
    public name: string = 'TimeoutError';
    public message: string;
    public errorTrace: Error[];
    public constructor(origin: string, errorTrace: Error[]) {
        this.message = `Timeout Error in module ${origin}`;
        this.errorTrace = errorTrace;
    }
}

/**
 * @class TypeNotSupportedError
 * @implements {ResilientDBError}
 * - Thrown when an objects type is not was expected
 */
class TypeNotSupportedError implements ResilientDBError {
    public name: string = 'TypeNotSupportedError';
    public message: string;
    public unsupportedType: string;
    public constructor(origin: string, unsupportedType: string) {
        this.message = `TypeNotSupportedError in module ${origin}`;
        this.unsupportedType = unsupportedType;
    }
}

/**
 * @class ThresholdTooDeep
 * @implements {ResilientDBError}
 * - Thrown when recursive depth when recreating threshold subconditions is too deep
 */
class ThresholdTooDeep implements ResilientDBError {
    public name: string = 'ThresholdTooDeep';
    public message: string;
    public constructor(origin: string) {
        this.message = `ThresholdTooDeep in module ${origin}`;
    }
}

/**
 * @class ValueError
 * @implements {ResilientDBError}
 * - Thrown when the value was outside of what was expected
 */
class ValueError implements ResilientDBError {
    public name: string = 'ValueError';
    public message: string;
    public constructor(variable: string) {
        this.message = `ValueError because of variable: ${variable}`;
    }
}

/**
 * @class KeypairMismatchError
 * @implements {ResilientDBError}
 * - Thrown dictionary is missing a value corresponding to a given key
 */
class KeypairMismatchError implements ResilientDBError {
    public name: string = 'KeypairMismatchError';
    public message: string;
    public constructor(variable: string) {
        this.message = `KeypairMismatchError because of variable: ${variable}`;
    }
}

/**
 * @class AssetIdMismatchError
 * @implements {ResilientDBError}
 * - Thrown when multiple asset ids exist for a transaction
 */
class AssetIdMismatchError implements ResilientDBError {
    public name: string = 'AssetIdMismatchError';
    public message: string;
    public constructor(variable: string, message?: string) {
        this.message = `AssetIdMismatchError because of variable: ${variable}
                        \n${message}`;
    }
}

/**
 * @class InvalidHashError
 * @implements {ResilientDBError}
 * - Thrown when the hash_id does not match with expected id
 */
class InvalidHashError implements ResilientDBError {
    public name: string = 'InvalidHashError';
    public message: string;
    public constructor(variable: string, message?: string) {
        this.message = `InvalidHashError because of variable: ${variable}
                        \n${message}`;
    }
}

class InputDoesNotExist implements ResilientDBError {
    public name: string = 'InputDoesNotExist';
    public message: string;
    public constructor(message?: string) {
        this.message = `InputDoesNotExis: ${message}`;
    }
}

export {
    ValueError,
    TimeoutError,
    TypeNotSupportedError,
    ThresholdTooDeep,
    KeypairMismatchError,
    AssetIdMismatchError,
    InvalidHashError,
    InputDoesNotExist,
};

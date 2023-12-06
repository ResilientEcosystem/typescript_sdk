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
interface ResilientDBError extends Error {
}
/**
 * @class TimeoutError
 * @implements {ResilientDBError}
 * - Collects timeout errors
 */
declare class TimeoutError implements ResilientDBError {
    name: string;
    message: string;
    errorTrace: Error[];
    constructor(origin: string, errorTrace: Error[]);
}
/**
 * @class TypeNotSupportedError
 * @implements {ResilientDBError}
 * - Thrown when an objects type is not was expected
 */
declare class TypeNotSupportedError implements ResilientDBError {
    name: string;
    message: string;
    unsupportedType: string;
    constructor(origin: string, unsupportedType: string);
}
/**
 * @class ThresholdTooDeep
 * @implements {ResilientDBError}
 * - Thrown when recursive depth when recreating threshold subconditions is too deep
 */
declare class ThresholdTooDeep implements ResilientDBError {
    name: string;
    message: string;
    constructor(origin: string);
}
/**
 * @class ValueError
 * @implements {ResilientDBError}
 * - Thrown when the value was outside of what was expected
 */
declare class ValueError implements ResilientDBError {
    name: string;
    message: string;
    constructor(variable: string);
}
/**
 * @class KeypairMismatchError
 * @implements {ResilientDBError}
 * - Thrown dictionary is missing a value corresponding to a given key
 */
declare class KeypairMismatchError implements ResilientDBError {
    name: string;
    message: string;
    constructor(variable: string);
}
/**
 * @class AssetIdMismatchError
 * @implements {ResilientDBError}
 * - Thrown when multiple asset ids exist for a transaction
 */
declare class AssetIdMismatchError implements ResilientDBError {
    name: string;
    message: string;
    constructor(variable: string, message?: string);
}
/**
 * @class InvalidHashError
 * @implements {ResilientDBError}
 * - Thrown when the hash_id does not match with expected id
 */
declare class InvalidHashError implements ResilientDBError {
    name: string;
    message: string;
    constructor(variable: string, message?: string);
}
declare class InputDoesNotExist implements ResilientDBError {
    name: string;
    message: string;
    constructor(message?: string);
}
export { ValueError, TimeoutError, TypeNotSupportedError, ThresholdTooDeep, KeypairMismatchError, AssetIdMismatchError, InvalidHashError, InputDoesNotExist, };

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

import type {
    AxiosHeaders,
    AxiosRequestConfig,
    AxiosResponse,
    Method,
} from 'axios';

/**
 * @interface UpdateBackoffConfig
 * @param {number} backoffCapInMs - Optional
 * @param {number} numRetries - Optional
 */
export interface UpdateBackoffConfig {
    backoffCapInMs?: number;
    numRetries?: number;
}

/**
 * @interface RequestConfig
 * @param {number} backoffCap - Optional
 * @param {number} timeout - Optional
 * @param {AxiosRequestConfig} axiosConfig - Optional
 */
export interface RequestConfig {
    backoffCap?: number;
    timeout?: number;
    axiosConfig?: AxiosRequestConfig;
}

/**
 * @interface ConnectionInterface
 * @method getBackoffInMs
 * @method getNodeUrl
 * @method request
 */
export interface ConnectionInterface {
    getBackoffInMs(): number;
    getNodeUrl(): string;
    request(
        method: Method,
        path: string,
        config: RequestConfig
    ): Promise<[AxiosResponse | undefined, Error | undefined]>;
}

/**
 * @interface ConnectionConstructor
 * @constructor Creates ConnectionConstructor instance
 */
interface ConnectionConstructor {
    new (nodeUrl: string, headers: AxiosHeaders): ConnectionInterface;
}

/**
 * @var ConnectionInterface
 * Ambient declaration to link the ConnectionInterface with the static ConnectionConstructor
 * Allows you to have static members in ConnectionInterface interface
 */
export declare var ConnectionInterface: ConnectionConstructor;

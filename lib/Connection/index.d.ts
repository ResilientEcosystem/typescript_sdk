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
import { AxiosHeaders } from 'axios';
import type { Method, AxiosResponse } from 'axios';
import { ConnectionInterface, RequestConfig } from './interface';
/**
 * @interface Connection
 * @implements {ConnectionInterface}
 */
export declare class Connection implements ConnectionInterface {
    /**
     * @public
     * @static
     * @readonly
     * @member {number} BACKOFF_TIMEDELTA_IN_MS - Max backoff timedelta in milliseconds
     */
    static readonly BACKOFF_TIMEDELTA_IN_MS: number;
    /**
     * @private
     * @readonly
     * @member {string} nodeUrl - The node's connection url
     */
    private readonly nodeUrl;
    /**
     * @private
     * @member {AxiosInstance} session - The axios session for queries
     */
    private session;
    /**
     * @private
     * @member {number} backoffInMs - The current backoff in milliseconds
     */
    private backoffInMs;
    /**
     * @constructor
     * @public
     * Returns an instance of the Connection class
     * @param {string} nodeUrl the connection url
     * @param {AxiosHeaders} headers Headers for the axios session
     * @returns {Connection} Returns connection instance
     */
    constructor(nodeUrl: string, headers?: AxiosHeaders);
    /**
     * @method getBackoffInMs
     * @public
     * Returns backoff time in milliseconds in class instance
     * @returns {number}
     */
    getBackoffInMs(): number;
    /**
     * @method getNodeUrl
     * @public
     * Returns nodeurl in class instance
     * @returns {string}
     */
    getNodeUrl(): string;
    /**
     * @method delay
     * @private
     * Wait function. Delays further function execution by `timeoutInMs` milliseconds
     * @param {number} timeoutInMs Milliseconds to timeout
     * @returns {Promise<void>}
     */
    private delay;
    /**
     * @method request
     * @public
     * Public interface to make a request using a valid request `method`
     * @param {string} method Request type `POST` || `GET` || `UPDATE` || `DELETE` || OTHERS
     * @param {string} path the subpath for the link
     * @param {RequestConfig} requestConfig Additional requet config options
     * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Errors are caught. Check for errors after calling.
     */
    request(method: Method, path: string, requestConfig?: RequestConfig): Promise<[AxiosResponse | undefined, Error | undefined]>;
    /**
     * @method getSession
     * @private
     * Get the axios instance, `this.session`
     * @returns {AxiosInstance}
     */
    private getSession;
    /**
     * @method _request
     * @private
     * Private request function to hide public API implementation
     * This function can error. The error will be caught in the public request API.
     * @param {string} method Request type `POST` || `GET` || `UPDATE` || `DELETE` || OTHERS
     * @param {string} path the subpath for the link
     * @param {AxiosRequestConfig} axiosConfig Additional axios request config options
     * @returns {Promise<AxiosResponse>} Returns axios response
     */
    private _request;
    /**
     * @method updateBackoffInMs
     * @private
     * Private function updateBackoffInMs
     * @param {boolean} isSuccess Was the axiosrequest successful?
     * @param {UpdateBackoffConfig} config Includes `backoffCapInMs` and `numRetries`
     * @returns {void}
     */
    private updateBackoffInMs;
}

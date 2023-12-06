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
import AxiosAdapter from '../utils/axiosAdapter';
import logger from '../utils/logger';

import type {
    AxiosInstance,
    Method,
    AxiosResponse,
    AxiosRequestConfig,
} from 'axios';

import {
    ConnectionInterface,
    RequestConfig,
    UpdateBackoffConfig,
} from './interface';

/**
 * @interface Connection
 * @implements {ConnectionInterface}
 */
export class Connection implements ConnectionInterface {
    /**
     * @public
     * @static
     * @readonly
     * @member {number} BACKOFF_TIMEDELTA_IN_MS - Max backoff timedelta in milliseconds
     */
    public static readonly BACKOFF_TIMEDELTA_IN_MS: number = 500;

    /**
     * @private
     * @readonly
     * @member {string} nodeUrl - The node's connection url
     */
    private readonly nodeUrl: string;

    /**
     * @private
     * @member {AxiosInstance} session - The axios session for queries
     */
    private session: AxiosInstance;

    /**
     * @private
     * @member {number} backoffInMs - The current backoff in milliseconds
     */
    private backoffInMs: number;

    /**
     * @constructor
     * @public
     * Returns an instance of the Connection class
     * @param {string} nodeUrl the connection url
     * @param {AxiosHeaders} headers Headers for the axios session
     * @returns {Connection} Returns connection instance
     */
    public constructor(
        nodeUrl: string,
        headers: AxiosHeaders = new AxiosHeaders()
    ) {
        this.nodeUrl = nodeUrl;
        this.backoffInMs = 0;
        this.session = AxiosAdapter.createAxiosSession(nodeUrl, headers);
    }

    /**
     * @method getBackoffInMs
     * @public
     * Returns backoff time in milliseconds in class instance
     * @returns {number}
     */
    public getBackoffInMs(): number {
        return this.backoffInMs;
    }

    /**
     * @method getNodeUrl
     * @public
     * Returns nodeurl in class instance
     * @returns {string}
     */
    public getNodeUrl(): string {
        return this.nodeUrl;
    }

    /**
     * @method delay
     * @private
     * Wait function. Delays further function execution by `timeoutInMs` milliseconds
     * @param {number} timeoutInMs Milliseconds to timeout
     * @returns {Promise<void>}
     */
    private async delay(timeoutInMs: number): Promise<void> {
        return await new Promise((r) => setTimeout(r, timeoutInMs));
    }

    /**
     * @method request
     * @public
     * Public interface to make a request using a valid request `method`
     * @param {string} method Request type `POST` || `GET` || `UPDATE` || `DELETE` || OTHERS
     * @param {string} path the subpath for the link
     * @param {RequestConfig} requestConfig Additional requet config options
     * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Errors are caught. Check for errors after calling.
     */
    public async request(
        method: Method,
        path: string,
        requestConfig?: RequestConfig
    ): Promise<[AxiosResponse | undefined, Error | undefined]> {
        await this.delay(this.getBackoffInMs());
        let response: AxiosResponse | undefined;
        try {
            response = await this._request(
                method,
                path,
                requestConfig?.axiosConfig
            );
            this.updateBackoffInMs(true, {
                backoffCapInMs: requestConfig?.backoffCap,
                numRetries: Number(response?.config['axios-retry']),
            });
            return [response, undefined];
        } catch (err) {
            logger.error('Error during axios request', {
                err,
                method,
                path,
                requestConfig,
            });
            this.updateBackoffInMs(false, {
                backoffCapInMs: requestConfig?.backoffCap,
                numRetries: Number(response?.config['axios-retry']),
            });
            return [undefined, err];
        }
    }

    /**
     * @method getSession
     * @private
     * Get the axios instance, `this.session`
     * @returns {AxiosInstance}
     */
    private getSession(): AxiosInstance {
        return this.session;
    }

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
    private async _request(
        method: string,
        path: string,
        axiosConfig?: AxiosRequestConfig
    ): Promise<AxiosResponse> {
        const response: AxiosResponse = await this.getSession().request({
            method,
            url: path,
            ...axiosConfig,
        });
        return response;
    }

    /**
     * @method updateBackoffInMs
     * @private
     * Private function updateBackoffInMs
     * @param {boolean} isSuccess Was the axiosrequest successful?
     * @param {UpdateBackoffConfig} config Includes `backoffCapInMs` and `numRetries`
     * @returns {void}
     */
    private updateBackoffInMs(
        isSuccess: boolean,
        config?: UpdateBackoffConfig
    ): void {
        if (isSuccess) {
            this.backoffInMs = 0;
            return;
        }
        this.backoffInMs = Math.min(
            Connection.BACKOFF_TIMEDELTA_IN_MS *
                Math.pow(2, config?.numRetries ?? 0),
            config?.backoffCapInMs ?? 0
        );
    }
}

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

import axios, { AxiosHeaders, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

/**
 * @class AxiosAdapter
 * @static
 * @method createAxiosSession
 */
class AxiosAdapter {
    /**
     * @method createAxiosSession
     * @static
     * @param {string} baseURL
     * @param {AxiosHeaders} headers
     * @returns {AxiosInstance} - Returns axios session with specified params
     */
    static createAxiosSession(
        baseURL: string,
        headers: AxiosHeaders
    ): AxiosInstance {
        const session: AxiosInstance = axios.create({
            baseURL,
            headers,
            timeout: 10000,
        });

        axiosRetry(session, {
            retries: 3, // Maximum number of retries
            retryDelay: axiosRetry.exponentialDelay, // Exponential delay between retries
            retryCondition: (error) => {
                return (
                    axiosRetry.isNetworkError(error) ||
                    (error.response && error.response.status === 500)
                );
            },
        });

        return session;
    }
}

export default AxiosAdapter;

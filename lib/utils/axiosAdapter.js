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
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
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
    static createAxiosSession(baseURL, headers) {
        const session = axios_1.default.create({
            baseURL,
            headers,
            timeout: 10000,
        });
        (0, axios_retry_1.default)(session, {
            retries: 3,
            retryDelay: axios_retry_1.default.exponentialDelay,
            retryCondition: (error) => {
                return (axios_retry_1.default.isNetworkError(error) ||
                    (error.response && error.response.status === 500));
            },
        });
        return session;
    }
}
exports.default = AxiosAdapter;

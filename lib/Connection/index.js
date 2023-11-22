"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
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
const axios_1 = require("axios");
const axiosAdapter_1 = __importDefault(require("../utils/axiosAdapter"));
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * @interface Connection
 * @implements {ConnectionInterface}
 */
class Connection {
    /**
     * @constructor
     * @public
     * Returns an instance of the Connection class
     * @param {string} nodeUrl the connection url
     * @param {AxiosHeaders} headers Headers for the axios session
     * @returns {Connection} Returns connection instance
     */
    constructor(nodeUrl, headers = new axios_1.AxiosHeaders()) {
        this.nodeUrl = nodeUrl;
        this.backoffInMs = 0;
        this.session = axiosAdapter_1.default.createAxiosSession(nodeUrl, headers);
    }
    /**
     * @method getBackoffInMs
     * @public
     * Returns backoff time in milliseconds in class instance
     * @returns {number}
     */
    getBackoffInMs() {
        return this.backoffInMs;
    }
    /**
     * @method getNodeUrl
     * @public
     * Returns nodeurl in class instance
     * @returns {string}
     */
    getNodeUrl() {
        return this.nodeUrl;
    }
    /**
     * @method delay
     * @private
     * Wait function. Delays further function execution by `timeoutInMs` milliseconds
     * @param {number} timeoutInMs Milliseconds to timeout
     * @returns {Promise<void>}
     */
    delay(timeoutInMs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((r) => setTimeout(r, timeoutInMs));
        });
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
    request(method, path, requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delay(this.getBackoffInMs());
            let response;
            try {
                response = yield this._request(method, path, requestConfig === null || requestConfig === void 0 ? void 0 : requestConfig.axiosConfig);
                this.updateBackoffInMs(true, {
                    backoffCapInMs: requestConfig === null || requestConfig === void 0 ? void 0 : requestConfig.backoffCap,
                    numRetries: Number(response === null || response === void 0 ? void 0 : response.config['axios-retry']),
                });
                return [response, undefined];
            }
            catch (err) {
                logger_1.default.error('Error during axios request', {
                    err,
                    method,
                    path,
                    requestConfig,
                });
                this.updateBackoffInMs(false, {
                    backoffCapInMs: requestConfig === null || requestConfig === void 0 ? void 0 : requestConfig.backoffCap,
                    numRetries: Number(response === null || response === void 0 ? void 0 : response.config['axios-retry']),
                });
                return [undefined, err];
            }
        });
    }
    /**
     * @method getSession
     * @private
     * Get the axios instance, `this.session`
     * @returns {AxiosInstance}
     */
    getSession() {
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
    _request(method, path, axiosConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getSession().request(Object.assign({ method, url: path }, axiosConfig));
            return response;
        });
    }
    /**
     * @method updateBackoffInMs
     * @private
     * Private function updateBackoffInMs
     * @param {boolean} isSuccess Was the axiosrequest successful?
     * @param {UpdateBackoffConfig} config Includes `backoffCapInMs` and `numRetries`
     * @returns {void}
     */
    updateBackoffInMs(isSuccess, config) {
        var _a, _b;
        if (isSuccess) {
            this.backoffInMs = 0;
            return;
        }
        this.backoffInMs = Math.min(Connection.BACKOFF_TIMEDELTA_IN_MS *
            Math.pow(2, (_a = config === null || config === void 0 ? void 0 : config.numRetries) !== null && _a !== void 0 ? _a : 0), (_b = config === null || config === void 0 ? void 0 : config.backoffCapInMs) !== null && _b !== void 0 ? _b : 0);
    }
}
exports.Connection = Connection;
/**
 * @public
 * @static
 * @readonly
 * @member {number} BACKOFF_TIMEDELTA_IN_MS - Max backoff timedelta in milliseconds
 */
Connection.BACKOFF_TIMEDELTA_IN_MS = 500;

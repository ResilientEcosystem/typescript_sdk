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
exports.Timer = void 0;
const lodash_1 = __importDefault(require("lodash"));
/**
 * @class Timer
 * @member startTime - Private
 * @method start - Start the timer
 * @updateTime - Stop and return the ellapsed time in ms
 * @method stop - Private
 */
class Timer {
    /**
     * @method start
     * @return {void} - Starts the timer
     */
    start() {
        this.startTime = new Date().getTime();
    }
    /**
     * @method stop - Private
     * @returns {number} - Returns the elapsedMilliseconds from the startTimestamp
     */
    stop() {
        const endTime = new Date().getTime();
        const elapsedMilliseconds = endTime - this.startTime;
        return elapsedMilliseconds;
    }
    /**
     * @method updateTime
     * @param {number | undefined} timeInMs
     * @returns {number | undefined} - Returns updated time after starting and stopping timer
     * - Returns undefined if the timeInMs is undefined. Only undefined once reaches 0 ms
     */
    updateTime(timeInMs) {
        if (lodash_1.default.isUndefined(timeInMs)) {
            return undefined;
        }
        return timeInMs - this.stop();
    }
}
exports.Timer = Timer;

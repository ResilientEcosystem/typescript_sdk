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

import * as _ from 'lodash';

import { PickerInterface, PoolInterface } from './interface';
import { ConnectionInterface } from '../Connection/interface';

/**
 * @class `RoundRobinPicker`
 * @implements {PickerInterface}
 */
export const RoundRobinPicker: PickerInterface = class {
    /**
     * @method pick
     * @param {ConnectionInterface[]} connections - Node connections
     * @returns {ConnectionInterface} - Return the node connection with the smallest backoff time in milliseconds. (FOR MAX EFFICIENCY)
     */
    static pick(connections: ConnectionInterface[]): ConnectionInterface {
        return _.minBy<ConnectionInterface>(connections, (connection) =>
            connection.getBackoffInMs()
        );
    }
};

/**
 * @class `Pool`
 * @implements {PoolInterface}
 */
export class Pool implements PoolInterface {
    public connections: ConnectionInterface[];
    public picker: PickerInterface;

    /**
     * @constructor Creates Pool Instance
     * @param {ConnectionInterface[]} connections
     * @param {PickerInterface} pickerInterface DEFAULT PICKER INTERFACE IS `RoundRobinPicker`
     */
    public constructor(
        connections: ConnectionInterface[],
        pickerInterface: PickerInterface = RoundRobinPicker
    ) {
        this.connections = connections;
        this.picker = pickerInterface;
    }

    /**
     * @method getConnection
     * @returns {ConnectionInterface} Returns node connection using the pickerInterface API
     */
    public getConnection(): ConnectionInterface {
        return this.picker.pick(this.connections);
    }
}

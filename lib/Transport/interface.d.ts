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
import type { Method, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { PoolInterface } from '../Pool/interface';
import type { Node } from '../ResDB/interface';
/**
 * @interface TransactionInterface
 * @member {Node[]} nodes
 * @member {number | undefined} timeoutInMs
 * @member {PoolInterface} connectionPool
 * @method forwardRequest
 */
export interface TransportInterface {
    nodes: Node[];
    timeoutInMs: number | undefined;
    connectionPool: PoolInterface;
    forwardRequest(method: Method, path: string, axiosConfig?: AxiosRequestConfig): Promise<[AxiosResponse | undefined, Error | undefined]>;
}
/**
 * @interface TransportConstructor
 * @constructor
 */
interface TransportConstructor {
    new (nodes: Node[], timeoutInMs?: number): TransportInterface;
}
/**
 * @interface TransactionInterface
 * Ambient declaration to link static and nonstatic members
 */
export declare var TransportInterface: TransportConstructor;
export {};

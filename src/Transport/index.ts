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

import { Pool } from '../Pool';
import { Connection } from '../Connection';
import { Timer } from './helper';

import { TimeoutError } from '../utils/errors';

import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import type { TransportInterface } from './interface';
import type { ConnectionInterface } from '../Connection/interface';
import type { PoolInterface } from '../Pool/interface';
import type { Node } from '../ResDB/interface';

class Transport implements TransportInterface {
    public static readonly NO_TIMEOUT_BACKOFF_CAP = 10000;
    public nodes: Node[];
    public timeoutInMs: number | undefined;
    public connectionPool: PoolInterface;
    public constructor(nodes: Node[], timeoutInMs?: number) {
        this.nodes = nodes;
        this.timeoutInMs = timeoutInMs;
        this.connectionPool = new Pool(
            Transport.constructEndpoints(this.nodes)
        );
    }

    private static constructEndpoints(nodes: Node[]): ConnectionInterface[] {
        return _.map<Node, Connection>(
            nodes,
            ({ headers, endpoint }) => new Connection(endpoint, headers)
        );
    }

    public async forwardRequest(
        method: Method,
        path: string,
        axiosConfig?: AxiosRequestConfig
    ): Promise<[AxiosResponse | undefined, Error | undefined]> {
        // match the error functionality that of the python sdk

        const errorTrace: Error[] = [];
        let timeout: number | undefined = this.timeoutInMs;
        const backoffCap: number = timeout || Transport.NO_TIMEOUT_BACKOFF_CAP;
        const timer: Timer = new Timer();

        while (_.isUndefined(timeout) || timeout > 0) {
            const connection: ConnectionInterface =
                this.connectionPool.getConnection();
            timer.start();

            let response: [AxiosResponse | undefined, Error | undefined];
            try {
                response = await connection.request(method, path, {
                    axiosConfig,
                    backoffCap,
                    timeout,
                });
            } catch (err) {
                errorTrace.push(err);
                timeout = timer.updateTime(timeout);
                continue;
            }
            timeout = timer.updateTime(timeout);
            return response;
        }
        return [undefined, new TimeoutError('Transport', errorTrace)];
    }
}

export { Transport };

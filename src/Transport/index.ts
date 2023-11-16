import * as _ from 'lodash';
import { Pool, PoolInterface } from '../Pool';
import { ConnectionInterface, Connection } from '../Connection';
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { TimeoutError } from '../utils/common/errors';

import { Node } from '../utils/common/types';

class Timer {
    private startTime: number;

    start() {
        this.startTime = new Date().getTime();
    }

    stop(): number {
        const endTime = new Date().getTime();
        const elapsedMilliseconds = endTime - this.startTime;
        return elapsedMilliseconds;
    }
}

const NO_TIMEOUT_BACKOFF_CAP = 10000;

interface TransportInterface {
    nodes: Node[];
    timeoutInMs: number | null;
    connectionPool: PoolInterface;
    forwardRequest(
        method: Method,
        path: string,
        axiosConfig?: AxiosRequestConfig
    ): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}

interface TransportConstructor {
    new (nodes: Node[], timeoutInMs: number): TransportInterface;
}

declare var TransportInterface: TransportConstructor;

class Transport implements TransportInterface {
    public nodes: Node[];
    public timeoutInMs: number;
    public connectionPool: PoolInterface;
    public constructor(nodes: Node[], timeoutInMs: number | null = null) {
        this.nodes = nodes;
        this.timeoutInMs = timeoutInMs;
        this.connectionPool = new Pool(this.constructEndpoints());
    }

    private constructEndpoints(): ConnectionInterface[] {
        return _.map<Node, Connection>(
            this.nodes,
            ({ headers, endpoint }) => new Connection(endpoint, headers)
        );
    }

    public async forwardRequest(
        method: Method,
        path: string,
        axiosConfig?: AxiosRequestConfig
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        // match the error functionality that of the python sdk

        const errorTrace: Error[] = [];
        let timeout: number | null = this.timeoutInMs;
        const backoffCap: number = timeout || NO_TIMEOUT_BACKOFF_CAP;

        while (_.isNull(timeout) || timeout > 0) {
            const connection: ConnectionInterface =
                this.connectionPool.getConnection();
            const timer: Timer = new Timer();
            timer.start();

            let response: Promise<
                [AxiosResponse<unknown> | null, Error | null]
            >;
            try {
                response = connection.request(method, path, {
                    axiosConfig,
                    backoffCap,
                    timeout,
                });
            } catch (err) {
                errorTrace.push(err);
                const ellapsedTime: number = timer.stop();
                if (!_.isNull(timeout)) {
                    timeout -= ellapsedTime;
                }
                continue;
            }
            const ellapsedTime: number = timer.stop();
            if (!_.isNull(timeout)) {
                timeout -= ellapsedTime;
            }
            return response;
        }
        return [null, new TimeoutError('Transport', errorTrace)];
    }
}

export { Transport, TransportInterface };

import * as _ from 'lodash';
import { Pool, PoolInterface } from '../Pool';
import { ConnectionInterface, Connection } from '../Connection';
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

import { Node } from '../utils/common/types';

const NO_TIMEOUT_BACKOFF_CAP = 10000;

interface TransportInterface {
    nodes: Node[];
    timeoutInMs: number;
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
    public constructor(nodes: Node[], timeoutInMs: number = 0) {
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
        // do some checking with the backoff delta, ensure no errors with the pool call
        return await this.connectionPool.getConnection().request(method, path, {
            backoffCap: NO_TIMEOUT_BACKOFF_CAP,
            axiosConfig,
        });
    }
}

export { Transport, TransportInterface };

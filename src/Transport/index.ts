import { Pool } from '../Pool';
import { ConnectionInterface, Connection } from '../Connection';
import { HttpMethodType, Node } from '../utils/types/Connection';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

const NO_TIMEOUT_BACKOFF_CAP = 10000;

class Transport {
    public nodes: Node[];
    public timeoutInMs: number;
    public connectionPool: Pool;
    public constructor(nodes: Node[], timeoutInMs: number = 0) {
        this.nodes = nodes;
        this.timeoutInMs = timeoutInMs;
        this.connectionPool = new Pool(this.constructEndpoints());
    }

    private constructEndpoints(): ConnectionInterface[] {
        return this.nodes.map(
            ({ headers, endpoint }) => new Connection(endpoint, headers)
        );
    }

    public async forwardRequest(
        method: HttpMethodType,
        path: string,
        axiosConfig?: AxiosRequestConfig<any>
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        // do some checking with the backoff delta, ensure no errors with the pool call
        return await this.connectionPool.getConnection().request(method, path, {
            backoffCap: NO_TIMEOUT_BACKOFF_CAP,
            axiosConfig,
        });
    }
}

export default Transport;

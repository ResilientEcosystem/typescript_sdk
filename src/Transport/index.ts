import { Pool } from '../Pool';
import Connection from '../Connection';
import NodeUtils from '../utils/common/nodeUtils';
import { HttpMethodType, Node } from '../utils/types/Connection';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

const NO_TIMEOUT_BACKOFF_CAP = 10000;

class Transport {
    public nodes: Node[];
    public timeoutInMs: number;
    public connection_pool: Pool;
    public constructor(nodes: Node[] | string[], timeoutInMs: number = 0) {
        this.nodes = NodeUtils.normalize_nodes(nodes, undefined);
        this.timeoutInMs = timeoutInMs;
        this.connection_pool = new Pool(this.construct_endpoints());
    }

    private construct_endpoints(): Connection[] {
        return this.nodes.map(
            ({ headers, endpoint }) => new Connection(endpoint, headers)
        );
    }

    public async forward_request(
        method: HttpMethodType,
        path: string,
        config?: AxiosRequestConfig<any>
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        // do some checking with the backoff delta, ensure no errors with the pool call
        return await this.connection_pool
            .getConnection()
            .request(method, path, NO_TIMEOUT_BACKOFF_CAP, config);
    }
}

export default Transport;

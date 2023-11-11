import { Pool } from '../Pool';
import NodeUtils from '../../lib/utils/common/nodeUtils';
import { Node } from '../utils/types/Connection';
import Connection from '../Connection';

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
}

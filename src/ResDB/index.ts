import { Transport, TransportInterface } from '../Transport';
import NodeUtils from '../utils/common/nodeUtils';
import { AxiosHeaders, AxiosResponse } from 'axios';

import {
    TransactionsEndpoint,
    OutputsEndpoint,
    BlocksEndpoint,
    AssetsEndpoint,
    MetadataEndpoint,
} from './endpoints';
import { Node } from '../utils/common/types';

interface ResDBConfig {
    transportModule?: typeof TransportInterface;
    headers?: AxiosHeaders;
    timeout?: number;
}

class Resdb {
    private _nodes: Node[];
    private _transport: TransportInterface;
    private _transaction: TransactionsEndpoint;
    private _outputs: OutputsEndpoint;
    private _assets: AssetsEndpoint;
    private _metadata: MetadataEndpoint;
    private _blocks: BlocksEndpoint;
    public api_prefix: string = process.env.RESDB_VERSION || '/v1';

    public constructor(nodes: string[] | Node[], config: ResDBConfig = {}) {
        const transportModule: typeof TransportInterface =
            config?.transportModule ?? Transport;

        this._nodes = NodeUtils.normalize_nodes(nodes, config.headers);
        this._transport = new transportModule(
            this._nodes,
            config?.timeout || 20
        );
        this._transaction = new TransactionsEndpoint(this);
        this._outputs = new OutputsEndpoint(this);
        this._assets = new AssetsEndpoint(this);
        this._metadata = new MetadataEndpoint(this);
        this._blocks = new BlocksEndpoint(this);
    }

    public nodes(): Node[] {
        return this._nodes;
    }

    public transaction(): TransactionsEndpoint {
        return this._transaction;
    }

    public outputs(): OutputsEndpoint {
        return this._outputs;
    }

    public asset(): AssetsEndpoint {
        return this._assets;
    }

    public metadata(): MetadataEndpoint {
        return this._metadata;
    }

    public transport(): TransportInterface {
        return this._transport;
    }

    public blocks(): BlocksEndpoint {
        return this._blocks;
    }

    public async info(
        headers: AxiosHeaders
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        return this.transport().forwardRequest('GET', '/', { headers });
    }
}

export default Resdb;

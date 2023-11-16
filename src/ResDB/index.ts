import { Transport, TransportInterface } from '../Transport';
import NodeUtils from '../utils/common/nodeUtils';
import { AxiosHeaders, AxiosResponse } from 'axios';

import { ResdbEndpoints } from './endpoints';
import { Node } from '../utils/common/types';

interface ResDBConfig {
    transportModule?: typeof TransportInterface;
    headers?: AxiosHeaders;
    timeout?: number;
}

class Resdb {
    private _nodes: Node[];
    private _transport: TransportInterface;
    private _transaction: ResdbEndpoints.TransactionsEndpoint;
    private _outputs: ResdbEndpoints.OutputsEndpoint;
    private _assets: ResdbEndpoints.AssetsEndpoint;
    private _metadata: ResdbEndpoints.MetadataEndpoint;
    private _blocks: ResdbEndpoints.BlocksEndpoint;
    public api_prefix: string = process.env.RESDB_VERSION || '/v1';

    public constructor(nodes: string[] | Node[], config: ResDBConfig = {}) {
        const transportModule: typeof TransportInterface =
            config?.transportModule ?? Transport;

        this._nodes = NodeUtils.normalize_nodes(nodes, config.headers);
        this._transport = new transportModule(
            this._nodes,
            config?.timeout || 20
        );
        this._transaction = new ResdbEndpoints.TransactionsEndpoint(this);
        this._outputs = new ResdbEndpoints.OutputsEndpoint(this);
        this._assets = new ResdbEndpoints.AssetsEndpoint(this);
        this._metadata = new ResdbEndpoints.MetadataEndpoint(this);
        this._blocks = new ResdbEndpoints.BlocksEndpoint(this);
    }

    public nodes(): Node[] {
        return this._nodes;
    }

    public transaction(): ResdbEndpoints.TransactionsEndpoint {
        return this._transaction;
    }

    public outputs(): ResdbEndpoints.OutputsEndpoint {
        return this._outputs;
    }

    public asset(): ResdbEndpoints.AssetsEndpoint {
        return this._assets;
    }

    public metadata(): ResdbEndpoints.MetadataEndpoint {
        return this._metadata;
    }

    public transport(): TransportInterface {
        return this._transport;
    }

    public blocks(): ResdbEndpoints.BlocksEndpoint {
        return this._blocks;
    }

    public async info(
        headers: AxiosHeaders
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        return this.transport().forwardRequest('GET', '/', { headers });
    }
}

export default Resdb;

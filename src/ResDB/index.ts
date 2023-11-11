import NodeUtils from '../utils/common/nodeUtils';
import {
    TransactionsEndpoint,
    OutputsEndpoint,
    BlocksEndpoint,
    AssetsEndpoint,
    MetadataEndpoint,
} from './endpoints';
import { DictionaryObject, Node } from '../utils/types/Connection';

interface ResDBConfig {
    headers?: DictionaryObject;
    timeout?: number;
}

class Resdb {
    private _nodes: Node[];
    private _transport: any;
    private _transaction: TransactionsEndpoint;
    private _outputs: OutputsEndpoint;
    private _assets: AssetsEndpoint;
    private _metadata: MetadataEndpoint;
    private _blocks: BlocksEndpoint;
    public api_prefix: string = process.env.RESDB_VERSION || '/v1';

    public constructor(
        nodes: string[] | Node[],
        tranport_module: any,
        config: ResDBConfig = {}
    ) {
        this._nodes = NodeUtils.normalize_nodes(nodes, config.headers);
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

    public transport(): any {
        return this._transport;
    }

    public blocks(): BlocksEndpoint {
        return this._blocks;
    }
}

export default Resdb;

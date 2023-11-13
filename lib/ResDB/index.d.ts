import { TransactionsEndpoint, OutputsEndpoint, BlocksEndpoint, AssetsEndpoint, MetadataEndpoint } from './endpoints';
import { DictionaryObject, Node } from '../utils/types/Connection';
import Transport from '../Transport';
interface ResDBConfig {
    headers?: DictionaryObject;
    timeout?: number;
}
declare class Resdb {
    private _nodes;
    private _transport;
    private _transaction;
    private _outputs;
    private _assets;
    private _metadata;
    private _blocks;
    api_prefix: string;
    constructor(nodes: string[] | Node[], transportModule?: typeof Transport, config?: ResDBConfig);
    nodes(): Node[];
    transaction(): TransactionsEndpoint;
    outputs(): OutputsEndpoint;
    asset(): AssetsEndpoint;
    metadata(): MetadataEndpoint;
    transport(): Transport;
    blocks(): BlocksEndpoint;
}
export default Resdb;

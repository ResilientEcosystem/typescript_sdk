import { TransportInterface } from '../Transport';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { TransactionsEndpoint, OutputsEndpoint, BlocksEndpoint, AssetsEndpoint, MetadataEndpoint } from './endpoints';
import { Node } from '../utils/types/Connection';
interface ResDBConfig {
    transportModule?: typeof TransportInterface;
    headers?: AxiosHeaders;
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
    constructor(nodes: string[] | Node[], config?: ResDBConfig);
    nodes(): Node[];
    transaction(): TransactionsEndpoint;
    outputs(): OutputsEndpoint;
    asset(): AssetsEndpoint;
    metadata(): MetadataEndpoint;
    transport(): TransportInterface;
    blocks(): BlocksEndpoint;
    info(headers: AxiosHeaders): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
export default Resdb;

import { TransportInterface } from '../Transport';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { ResdbEndpoints } from './endpoints';
import { Node } from '../utils/types';
interface ResDBConfig {
    transportModule?: typeof TransportInterface;
    headers?: AxiosHeaders;
    timeout?: number;
}
interface ResdbInterface {
    api_prefix: string;
    nodes(): Node[];
    transaction(): ResdbEndpoints.TransactionsEndpoint;
    outputs(): ResdbEndpoints.OutputsEndpoint;
    asset(): ResdbEndpoints.AssetsEndpoint;
    metadata(): ResdbEndpoints.MetadataEndpoint;
    transport(): TransportInterface;
    blocks(): ResdbEndpoints.BlocksEndpoint;
    info(headers: AxiosHeaders): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    apiInfo(headers: AxiosHeaders): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    getTransaction(txid: string): Promise<void>;
}
interface ResdbConstructor {
    new (nodes: string[] | Node[], config: ResDBConfig): ResdbInterface;
}
declare var ResdbInterface: ResdbConstructor;
declare class Resdb implements ResdbInterface {
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
    transaction(): ResdbEndpoints.TransactionsEndpoint;
    outputs(): ResdbEndpoints.OutputsEndpoint;
    asset(): ResdbEndpoints.AssetsEndpoint;
    metadata(): ResdbEndpoints.MetadataEndpoint;
    transport(): TransportInterface;
    blocks(): ResdbEndpoints.BlocksEndpoint;
    info(headers: AxiosHeaders): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    apiInfo(headers: AxiosHeaders): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    getTransaction(txid: string): Promise<void>;
}
export default Resdb;

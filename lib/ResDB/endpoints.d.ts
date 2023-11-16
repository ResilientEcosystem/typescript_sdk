import Resdb from './index';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { TransportInterface } from '../Transport';
import { DictionaryObject } from '../utils/common/types';
interface GetEndpointConfig {
    headers?: AxiosHeaders;
}
interface GetTransactionsEndpointConfig extends GetEndpointConfig {
    operation?: string;
}
interface GetOutputsEndpointConfig extends GetEndpointConfig {
    spent?: boolean;
}
interface GetBlocksEndpointConfig extends GetEndpointConfig {
}
interface GetAssetsEndpointConfig extends GetEndpointConfig {
    limit?: number;
}
interface GetMetadataEndpointConfig extends GetEndpointConfig {
    limit?: number;
}
export declare namespace ResdbEndpoints {
    interface Endpoint {
        get(...args: unknown[]): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    }
    abstract class NamespacedDriver implements Endpoint {
        private readonly _path;
        private readonly _driver;
        constructor(path: string, driver: Resdb);
        transport(): TransportInterface;
        api_prefix(): string;
        path(): string;
        abstract get(...args: unknown[]): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    }
    export class TransactionsEndpoint extends NamespacedDriver {
        constructor(driver: Resdb);
        /** WAITING ON ANOTHER FILE
         * public static prepare();
         * public static fulfill();
         */
        get(asset_id: string, config: GetTransactionsEndpointConfig): Promise<[AxiosResponse<unknown> | null, Error | null]>;
        /** NOT IMPLEMENTED
         * public send_async(transaction, headers: DictionaryObject = {});
         * public send_sync(transaction, headers: DictionaryObject = {})
         */
        sendCommit(transaction: DictionaryObject, headers?: AxiosHeaders): Promise<[AxiosResponse<unknown> | null, Error | null]>;
        retrieve(txid: string, headers?: AxiosHeaders): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    }
    export class OutputsEndpoint extends NamespacedDriver {
        constructor(driver: Resdb);
        get(public_key: string, config: GetOutputsEndpointConfig): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    }
    export class BlocksEndpoint extends NamespacedDriver {
        constructor(driver: Resdb);
        get(txid: string, config: GetBlocksEndpointConfig): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    }
    export class AssetsEndpoint extends NamespacedDriver {
        constructor(driver: Resdb);
        get(search: string, config: GetAssetsEndpointConfig): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    }
    export class MetadataEndpoint extends NamespacedDriver {
        constructor(driver: Resdb);
        get(search: string, config: GetMetadataEndpointConfig): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    }
    export {};
}
export {};

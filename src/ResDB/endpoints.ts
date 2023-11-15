import Resdb from './index';

import { AxiosHeaders, AxiosResponse } from 'axios';
import { TransportInterface } from '../Transport';
import { DictionaryObject } from '../utils/types/Connection';

interface Endpoint {
    get(
        ...args: unknown[]
    ): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}

interface GetEndpointConfig {
    [key: string]: any;
    headers?: AxiosHeaders;
}

interface GetTransactionsEndpointConfig extends GetEndpointConfig {
    operation?: string;
}

interface GetOutputsEndpointConfig extends GetEndpointConfig {
    spent: boolean;
}

// create interface for future expansion if needed
interface GetBlocksEndpointConfig extends GetEndpointConfig {}

interface GetAssetsEndpointConfig extends GetEndpointConfig {
    limit: number;
}

interface GetMetadataEndpointConfig extends GetEndpointConfig {
    limit: number;
}

abstract class NamespacedDriver implements Endpoint {
    private readonly _path: string;
    private readonly _driver: Resdb;

    public constructor(path: string, driver: Resdb) {
        this._path = path;
        this._driver = driver;
    }

    public transport(): TransportInterface {
        return this._driver.transport();
    }

    public api_prefix(): string {
        return this._driver.api_prefix;
    }

    public path(): string {
        return this.api_prefix() + this._path;
    }

    abstract get(
        ...args: unknown[]
    ): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}

class TransactionsEndpoint extends NamespacedDriver {
    public constructor(driver: Resdb) {
        super('/transactions/', driver);
    }

    /** WAITING ON ANOTHER FILE
     * public static prepare();
     * public static fulfill();
     */

    public async get(
        asset_id: string,
        config: GetTransactionsEndpointConfig
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        return await this.transport().forwardRequest('GET', this.path(), {
            params: { asset_id, operation: config?.operation },
            headers: config?.headers,
        });
    }

    /** NOT IMPLEMENTED
     * public send_async(transaction, headers: DictionaryObject = {});
     * public send_sync(transaction, headers: DictionaryObject = {})
     */

    public async sendCommit(
        transaction: DictionaryObject,
        headers?: AxiosHeaders
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        const path = this.path() + 'commit';
        return await this.transport().forwardRequest('POST', path, {
            data: transaction, // is this right?
            headers,
        });
    }

    public async retrieve(
        txid: string,
        headers?: AxiosHeaders
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        const path = this.path() + txid;
        return await this.transport().forwardRequest('POST', path, {
            headers,
        });
    }
}

class OutputsEndpoint extends NamespacedDriver {
    public constructor(driver: Resdb) {
        super('/outputs/', driver);
    }

    public async get(
        public_key: string,
        config: GetOutputsEndpointConfig
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        return await this.transport().forwardRequest('GET', this.path(), {
            params: { public_key, spent: config?.spent },
            headers: config?.headers,
        });
    }
}

class BlocksEndpoint extends NamespacedDriver {
    public constructor(driver: Resdb) {
        super('/blocks/', driver);
    }
    public async get(
        txid: string,
        config: GetBlocksEndpointConfig
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        return await this.transport().forwardRequest('GET', this.path(), {
            params: { transaction_id: txid },
            headers: config?.headers,
        });
    }
}

class AssetsEndpoint extends NamespacedDriver {
    public constructor(driver: Resdb) {
        super('/assets/', driver);
    }
    public async get(
        search: string,
        config: GetAssetsEndpointConfig
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        return await this.transport().forwardRequest('GET', this.path(), {
            params: { search, limit: config?.limit },
            headers: config?.headers,
        });
    }
}

class MetadataEndpoint extends NamespacedDriver {
    public constructor(driver: Resdb) {
        super('/metadata/', driver);
    }
    public async get(
        search: string,
        config: GetMetadataEndpointConfig
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        return await this.transport().forwardRequest('GET', this.path(), {
            params: { search, limit: config?.limit },
            headers: config?.headers,
        });
    }
}

export {
    TransactionsEndpoint,
    OutputsEndpoint,
    BlocksEndpoint,
    AssetsEndpoint,
    MetadataEndpoint,
};

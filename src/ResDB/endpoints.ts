import Resdb from './index';

import { DictionaryObject } from '../utils/types/Connection';

interface Endpoint {
    get(...args: unknown[]): Object;
}

abstract class NamespacedDriver implements Endpoint {
    private readonly _path: string;
    private readonly _driver: Resdb;

    public constructor(path: string, driver: Resdb) {
        this._path = path;
        this._driver = driver;
    }

    public transport(): any {
        return this._driver.transport();
    }

    public api_prefix(): string {
        return this._driver.api_prefix;
    }

    public path(): string {
        return this.api_prefix() + this._path;
    }

    abstract get(...args: unknown[]): Object;
}

class TransactionsEndpoint extends NamespacedDriver {
    public constructor(driver: Resdb) {
        super('/transactions/', driver);
    }

    // public static prepare();
    // public static fulfill();
    public get(
        asset_id: string,
        operation: string,
        headers: DictionaryObject
    ): Object {
        return this.transport;
    }
    // public send_async(transaction, headers: DictionaryObject = {});
    // public send_sync(transaction, headers: DictionaryObject = {})
    // public send_commit();

    // public retrieve(txid: string, headers: DictionaryObject = {}): Object {

    // }
}

class OutputsEndpoint extends NamespacedDriver {
    public constructor(driver: Resdb) {
        super('/outputs/', driver);
    }

    public get(
        public_key: string,
        spent: boolean = false,
        headers: DictionaryObject = {}
    ): Object {
        return {};
    }
}

class BlocksEndpoint extends NamespacedDriver {
    public constructor(driver: Resdb) {
        super('/blocks/', driver);
    }
    public get(txid: string, headers: DictionaryObject): Object {
        return {};
    }
}

class AssetsEndpoint extends NamespacedDriver {
    public constructor(driver: Resdb) {
        super('/assets/', driver);
    }
    public get(
        search: string,
        limit: number = 0,
        headers: DictionaryObject
    ): Object {
        return {};
    }
}

class MetadataEndpoint extends NamespacedDriver {
    public constructor(driver: Resdb) {
        super('/metadata/', driver);
    }
    public get(
        search: string,
        limit: number = 0,
        headers: DictionaryObject
    ): Object {
        return {};
    }
}

export {
    TransactionsEndpoint,
    OutputsEndpoint,
    BlocksEndpoint,
    AssetsEndpoint,
    MetadataEndpoint,
};

import { DictionaryObject } from '../utils/types/Connection';
import Resdb from './index';
interface Endpoint {
    get(...args: unknown[]): Object;
}
declare abstract class NamespacedDriver implements Endpoint {
    private readonly _path;
    private readonly _driver;
    constructor(path: string, driver: Resdb);
    transport(): any;
    api_prefix(): string;
    path(): string;
    abstract get(...args: unknown[]): Object;
}
declare class TransactionsEndpoint extends NamespacedDriver {
    constructor(driver: Resdb);
    get(asset_id: string, operation: string, headers: DictionaryObject): Object;
}
declare class OutputsEndpoint extends NamespacedDriver {
    constructor(driver: Resdb);
    get(public_key: string, spent?: boolean, headers?: DictionaryObject): Object;
}
declare class BlocksEndpoint extends NamespacedDriver {
    constructor(driver: Resdb);
    get(txid: string, headers: DictionaryObject): Object;
}
declare class AssetsEndpoint extends NamespacedDriver {
    constructor(driver: Resdb);
    get(search: string, limit: number, headers: DictionaryObject): Object;
}
declare class MetadataEndpoint extends NamespacedDriver {
    constructor(driver: Resdb);
    get(search: string, limit: number, headers: DictionaryObject): Object;
}
export { TransactionsEndpoint, OutputsEndpoint, BlocksEndpoint, AssetsEndpoint, MetadataEndpoint, };

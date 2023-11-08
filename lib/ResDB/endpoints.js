"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataEndpoint = exports.AssetsEndpoint = exports.BlocksEndpoint = exports.OutputsEndpoint = exports.TransactionsEndpoint = void 0;
class NamespacedDriver {
    constructor(path, driver) {
        this._path = path;
        this._driver = driver;
    }
    transport() {
        return this._driver.transport();
    }
    api_prefix() {
        return this._driver.api_prefix;
    }
    path() {
        return this.api_prefix() + this._path;
    }
}
class TransactionsEndpoint extends NamespacedDriver {
    constructor(driver) {
        super("/transactions/", driver);
    }
    ;
    // public static prepare();
    // public static fulfill();
    get(asset_id, operation, headers) {
        return this.transport;
    }
}
exports.TransactionsEndpoint = TransactionsEndpoint;
class OutputsEndpoint extends NamespacedDriver {
    constructor(driver) {
        super("/outputs/", driver);
    }
    get(public_key, spent = false, headers = {}) {
        return {};
    }
}
exports.OutputsEndpoint = OutputsEndpoint;
class BlocksEndpoint extends NamespacedDriver {
    constructor(driver) {
        super("/blocks/", driver);
    }
    get(txid, headers) {
        return {};
    }
}
exports.BlocksEndpoint = BlocksEndpoint;
class AssetsEndpoint extends NamespacedDriver {
    constructor(driver) {
        super("/assets/", driver);
    }
    get(search, limit = 0, headers) {
        return {};
    }
}
exports.AssetsEndpoint = AssetsEndpoint;
class MetadataEndpoint extends NamespacedDriver {
    constructor(driver) {
        super("/metadata/", driver);
    }
    get(search, limit = 0, headers) {
        return {};
    }
}
exports.MetadataEndpoint = MetadataEndpoint;

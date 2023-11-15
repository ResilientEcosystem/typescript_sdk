"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        super('/transactions/', driver);
    }
    /** WAITING ON ANOTHER FILE
     * public static prepare();
     * public static fulfill();
     */
    get(asset_id, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transport().forwardRequest('GET', this.path(), {
                params: { asset_id, operation: config === null || config === void 0 ? void 0 : config.operation },
                headers: config === null || config === void 0 ? void 0 : config.headers,
            });
        });
    }
    /** NOT IMPLEMENTED
     * public send_async(transaction, headers: DictionaryObject = {});
     * public send_sync(transaction, headers: DictionaryObject = {})
     */
    sendCommit(transaction, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.path() + 'commit';
            return yield this.transport().forwardRequest('POST', path, {
                data: transaction,
                headers,
            });
        });
    }
    retrieve(txid, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.path() + txid;
            return yield this.transport().forwardRequest('POST', path, {
                headers,
            });
        });
    }
}
exports.TransactionsEndpoint = TransactionsEndpoint;
class OutputsEndpoint extends NamespacedDriver {
    constructor(driver) {
        super('/outputs/', driver);
    }
    get(public_key, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transport().forwardRequest('GET', this.path(), {
                params: { public_key, spent: config === null || config === void 0 ? void 0 : config.spent },
                headers: config === null || config === void 0 ? void 0 : config.headers,
            });
        });
    }
}
exports.OutputsEndpoint = OutputsEndpoint;
class BlocksEndpoint extends NamespacedDriver {
    constructor(driver) {
        super('/blocks/', driver);
    }
    get(txid, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transport().forwardRequest('GET', this.path(), {
                params: { transaction_id: txid },
                headers: config === null || config === void 0 ? void 0 : config.headers,
            });
        });
    }
}
exports.BlocksEndpoint = BlocksEndpoint;
class AssetsEndpoint extends NamespacedDriver {
    constructor(driver) {
        super('/assets/', driver);
    }
    get(search, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transport().forwardRequest('GET', this.path(), {
                params: { search, limit: config === null || config === void 0 ? void 0 : config.limit },
                headers: config === null || config === void 0 ? void 0 : config.headers,
            });
        });
    }
}
exports.AssetsEndpoint = AssetsEndpoint;
class MetadataEndpoint extends NamespacedDriver {
    constructor(driver) {
        super('/metadata/', driver);
    }
    get(search, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transport().forwardRequest('GET', this.path(), {
                params: { search, limit: config === null || config === void 0 ? void 0 : config.limit },
                headers: config === null || config === void 0 ? void 0 : config.headers,
            });
        });
    }
}
exports.MetadataEndpoint = MetadataEndpoint;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionInterface = exports.Connection = void 0;
const axios_1 = require("axios");
const axiosAdapter_1 = __importDefault(require("../utils/common/axiosAdapter"));
const logger_1 = __importDefault(require("../utils/common/logger"));
const BACKOFF_TIMEDELTA_IN_MS = 500;
class Connection {
    constructor(nodeUrl, headers = new axios_1.AxiosHeaders) {
        this.nodeUrl = nodeUrl;
        this.backoffInMs = 0;
        this.session = axiosAdapter_1.default.createAxiosSession(nodeUrl, headers);
    }
    getSession() {
        return this.session;
    }
    _request(method, path, axiosConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getSession().request(Object.assign({ method, url: path }, axiosConfig));
            return response;
        });
    }
    getBackoffInMs() {
        return this.backoffInMs;
    }
    updateBackoffInMs(isSuccess, backoffCapInMs = 0, numRetries = 0) {
        if (isSuccess) {
            this.backoffInMs = 0;
            return;
        }
        this.backoffInMs = Math.min(BACKOFF_TIMEDELTA_IN_MS * Math.pow(2, numRetries), backoffCapInMs);
    }
    delay() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((r) => setTimeout(r, this.getBackoffInMs()));
        });
    }
    request(method, path, requestConfig) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delay();
            let response;
            try {
                response = yield this._request(method, path, requestConfig === null || requestConfig === void 0 ? void 0 : requestConfig.axiosConfig);
                this.updateBackoffInMs(true, (_a = requestConfig === null || requestConfig === void 0 ? void 0 : requestConfig.backoffCap) !== null && _a !== void 0 ? _a : 0, (_b = Number(response === null || response === void 0 ? void 0 : response.config['axios-retry'])) !== null && _b !== void 0 ? _b : 0);
                return [response, null];
            }
            catch (err) {
                logger_1.default.error('Error during axios request', {
                    err,
                    method,
                    path,
                    requestConfig,
                });
                this.updateBackoffInMs(false, (_c = requestConfig === null || requestConfig === void 0 ? void 0 : requestConfig.backoffCap) !== null && _c !== void 0 ? _c : 0, (_d = Number(response === null || response === void 0 ? void 0 : response.config['axios-retry'])) !== null && _d !== void 0 ? _d : 0);
                return [null, err];
            }
        });
    }
}
exports.Connection = Connection;

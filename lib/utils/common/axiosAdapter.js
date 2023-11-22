'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const axios_1 = __importDefault(require('axios'));
const axios_retry_1 = __importDefault(require('axios-retry'));
class AxiosAdapter {
    static createAxiosSession(baseURL, headers) {
        const session = axios_1.default.create({
            baseURL,
            headers,
            timeout: 10000,
        });
        (0, axios_retry_1.default)(session, {
            retries: 3,
            retryDelay: axios_retry_1.default.exponentialDelay,
            retryCondition: (error) => {
                var _a;
                return (_a =
                    axios_retry_1.default.isNetworkError(error) ||
                    (error.response && error.response.status === 500)) !==
                    undefined && _a !== void 0
                    ? _a
                    : false;
            },
        });
        return session;
    }
}
exports.default = AxiosAdapter;

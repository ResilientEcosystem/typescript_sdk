"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.TransportInterface = exports.Transport = void 0;
const _ = __importStar(require("lodash"));
const Pool_1 = require("../Pool");
const Connection_1 = require("../Connection");
const errors_1 = require("../utils/errors");
class Timer {
    start() {
        this.startTime = new Date().getTime();
    }
    stop() {
        const endTime = new Date().getTime();
        const elapsedMilliseconds = endTime - this.startTime;
        return elapsedMilliseconds;
    }
}
const NO_TIMEOUT_BACKOFF_CAP = 10000;
class Transport {
    constructor(nodes, timeoutInMs = null) {
        this.nodes = nodes;
        this.timeoutInMs = timeoutInMs;
        this.connectionPool = new Pool_1.Pool(this.constructEndpoints());
    }
    constructEndpoints() {
        return _.map(this.nodes, ({ headers, endpoint }) => new Connection_1.Connection(endpoint, headers));
    }
    forwardRequest(method, path, axiosConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            // match the error functionality that of the python sdk
            const errorTrace = [];
            let timeout = this.timeoutInMs;
            const backoffCap = timeout || NO_TIMEOUT_BACKOFF_CAP;
            while (_.isNull(timeout) || timeout > 0) {
                const connection = this.connectionPool.getConnection();
                const timer = new Timer();
                timer.start();
                let response;
                try {
                    response = connection.request(method, path, {
                        axiosConfig,
                        backoffCap,
                        timeout,
                    });
                }
                catch (err) {
                    errorTrace.push(err);
                    const ellapsedTime = timer.stop();
                    if (!_.isNull(timeout)) {
                        timeout -= ellapsedTime;
                    }
                    continue;
                }
                const ellapsedTime = timer.stop();
                if (!_.isNull(timeout)) {
                    timeout -= ellapsedTime;
                }
                return response;
            }
            return [null, new errors_1.TimeoutError('Transport', errorTrace)];
        });
    }
}
exports.Transport = Transport;

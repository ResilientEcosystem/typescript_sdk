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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize_nodes = void 0;
const url = __importStar(require("url"));
const luxon_1 = require("luxon");
const DEFAULT_NODE = process.env.DEFAULT_NODE || 'http://localhost:9984';
const serialize = (data = {}) => {
    const sortedKeys = Object.keys(data).sort();
    const sortedObject = {};
    for (const key of sortedKeys) {
        sortedObject[key] = data[key];
    }
    return JSON.stringify(sortedObject);
};
const gen_timestamp = () => {
    return luxon_1.DateTime.now().toUnixInteger().toString();
};
const _get_default_port = (scheme) => {
    return scheme == 'https' ? 443 : 9984;
};
const normalize_url = (node) => {
    if (!node) {
        node = DEFAULT_NODE;
    }
    else if (!node.includes('://')) {
        node = `//${node}`;
    }
    const parts = url.parse(node, true);
    const port = parts.port
        ? parts.port.toString()
        : _get_default_port(parts.protocol || '');
    const netloc = `${parts.hostname || ''}:${port}`;
    const modifiedURL = url.format({
        protocol: parts.protocol || 'http:',
        host: netloc,
        pathname: parts.pathname || '/',
    });
    return modifiedURL;
};
const normalize_node = (node, headers) => {
    if (!headers) {
        headers = {};
    }
    let url;
    if (typeof node === 'string') {
        url = normalize_url(node);
        return { endpoint: url, headers: headers };
    }
    url = normalize_url(node['endpoint']);
    // const node_headers = {...headers}
    return {
        endpoint: url,
        headers: Object.assign({}, headers),
    };
};
const normalize_nodes = (nodes, headers) => {
    if (!nodes.length) {
        return [normalize_node(DEFAULT_NODE, headers)];
    }
    const normalizedNodes = [];
    for (const n of nodes) {
        normalizedNodes.push(normalize_node(n, headers));
    }
    return normalizedNodes;
};
exports.normalize_nodes = normalize_nodes;

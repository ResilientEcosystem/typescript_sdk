"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
// from .exceptions import ValidationError
// def serialize(data: dict) -> str:
//     """! Serialize a dict into a JSON formatted string.
//     This function enforces rules like the separator and order of keys.
//     This ensures that all dicts are serialized in the same way.
//     This is specially important for hashing data. We need to make sure that
//     everyone serializes their data in the same way so that we do not have
//     hash mismatches for the same structure due to serialization
//     differences.
//     @param data (dict): Data to serialize
//     @return JSON formatted string
//     """
//     return rapidjson.dumps(data, skipkeys=False, ensure_ascii=False, sort_keys=True)
const serialize = (data = {}) => {
    // not complete
    return JSON.stringify(data);
};
const gen_timestamp = () => {
    return luxon_1.DateTime.now().toUnixInteger().toString();
};
const DEFAULT_NODE = "http://localhost:9984";
// class CreateOperation:
//     """! Class representing the ``'CREATE'`` transaction operation.
//     """
// class TransferOperation:
//     """! Class representing the ``'TRANSFER'`` transaction operation.
//     """
// ops_map = {
//     "CREATE": CreateOperation,
//     "TRANSFER": TransferOperation,
// }
// def _normalize_operation(operation):
//     """! Normalizes the given operation string. For now, this simply means
//     converting the given string to uppercase, looking it up in
//     :attr:`~.ops_map`, and returning the corresponding class if
//     present.
//     @param operation (str): The operation string to convert.
//     @return The class corresponding to the given string,
//             :class:`~.CreateOperation` or :class:`~TransferOperation`.
//         .. important:: If the :meth:`str.upper` step, or the
//             :attr:`~.ops_map` lookup fails, the given ``operation``
//             argument is returned.
//     """
//     try:
//         operation = operation.upper()
//     except AttributeError:
//         pass
//     try:
//         operation = ops_map[operation]()
//     except KeyError:
//         pass
//     return operation
const _get_default_port = (scheme) => {
    return scheme == "https" ? 443 : 9984;
};
const normalize_url = (node) => {
    if (!node) {
        node = DEFAULT_NODE;
    }
    else if (!node.includes("://")) {
        node = `//${node}`;
    }
    const parts = url.parse(node, true);
    const port = parts.port ? parts.port.toString() : _get_default_port(parts.protocol || '');
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
    if (typeof node === "string") {
        url = normalize_url(node);
        return { "endpoint": url, "headers": headers };
    }
    url = normalize_url(node["endpoint"]);
    // const node_headers = {...headers}
    return { "endpoint": url, "headers": Object.assign({}, headers) };
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

'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                  !desc ||
                  ('get' in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              });
          }
        : function (o, v) {
              o['default'] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != undefined)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
const url = __importStar(require('url'));
const _ = __importStar(require('lodash'));
const luxon_1 = require('luxon');
const axios_1 = require('axios');
class NodeUtils {}
_a = NodeUtils;
NodeUtils.DEFAULT_NODE = process.env.DEFAULT_NODE || 'http://localhost:9984';
NodeUtils.serialize = (data = {}) => {
    const sortedKeys = Object.keys(data).sort();
    const sortedObject = {};
    for (const key of sortedKeys) {
        sortedObject[key] = data[key];
    }
    return JSON.stringify(sortedObject);
};
NodeUtils.normalize_nodes = (nodes, headers) => {
    if (!nodes.length) {
        return [_a.normalize_node(_a.DEFAULT_NODE, headers)];
    }
    return _.map(nodes, (node) => _a.normalize_node(node, headers));
};
NodeUtils.gen_timestamp = () => {
    return luxon_1.DateTime.now().toUnixInteger().toString();
};
NodeUtils._get_default_port = (scheme) => {
    return scheme == 'https' ? 443 : 9984;
};
NodeUtils.normalize_url = (node) => {
    if (!node) {
        node = _a.DEFAULT_NODE;
    } else if (!node.includes('://')) {
        node = `//${node}`;
    }
    const parts = url.parse(node, true);
    const port = parts.port
        ? parts.port.toString()
        : _a._get_default_port(parts.protocol || '');
    const netloc = `${parts.hostname || ''}:${port}`;
    const modifiedURL = url.format({
        protocol: parts.protocol || 'http:',
        host: netloc,
        pathname: parts.pathname || '/',
    });
    return modifiedURL;
};
NodeUtils.normalize_node = (node, headers) => {
    if (!headers) {
        headers = new axios_1.AxiosHeaders();
    }
    let url;
    if (typeof node === 'string') {
        url = _a.normalize_url(node);
        return { endpoint: url, headers: headers };
    }
    url = _a.normalize_url(node['endpoint']);
    // MAKE SURE THIS IS NOT NEEDED
    // const node_headers = {...headers}
    return {
        endpoint: url,
        headers: new axios_1.AxiosHeaders(headers),
    };
};
exports.default = NodeUtils;

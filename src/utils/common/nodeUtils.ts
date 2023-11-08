import * as url from 'url';
import { DateTime } from 'luxon';
import { DictionaryObject, Node } from '../types/Connection';

const DEFAULT_NODE: string = process.env.DEFAULT_NODE;

const serialize = (data: DictionaryObject = {}): string => {
    const sortedKeys: string[] = Object.keys(data).sort();
    const sortedObject: Object = {};

    for (const key of sortedKeys) {
        sortedObject[key] = data[key];
    }
    return JSON.stringify(sortedObject);
};

const gen_timestamp = (): string => {
    return DateTime.now().toUnixInteger().toString();
};

const _get_default_port = (scheme: string): number => {
    return scheme == 'https' ? 443 : 9984;
};

const normalize_url = (node: string): string => {
    if (!node) {
        node = DEFAULT_NODE;
    } else if (!node.includes('://')) {
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

const normalize_node = (
    node: string | Node,
    headers: DictionaryObject | null
): Node => {
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
        headers: {
            ...headers,
            // ...node_headers
        },
    };
};

const normalize_nodes = (
    nodes: Node[] | string[],
    headers: DictionaryObject | null
): Node[] => {
    if (!nodes.length) {
        return [normalize_node(DEFAULT_NODE, headers)];
    }
    const normalizedNodes: Node[] = [];
    for (const n of nodes) {
        normalizedNodes.push(normalize_node(n, headers));
    }
    return normalizedNodes;
};

export {
    normalize_nodes
}

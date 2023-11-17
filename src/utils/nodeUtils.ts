import * as url from 'url';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { AxiosHeaders } from 'axios';
import { DictionaryObject, Node } from './types';

class NodeUtils {
    private static DEFAULT_NODE: string = 'http://localhost:9984';

    public static serialize = (data: DictionaryObject = {}): string => {
        const sortedKeys: string[] = Object.keys(data).sort();
        const sortedObject: Object = {};

        for (const key of sortedKeys) {
            sortedObject[key] = data[key];
        }
        return JSON.stringify(sortedObject);
    };

    public static normalize_nodes = (
        nodes: Node[] | string[],
        headers: AxiosHeaders | undefined
    ): Node[] => {
        if (!nodes.length) {
            return [this.normalize_node(this.DEFAULT_NODE, headers)];
        }
        return _.map<Node | string, Node>(nodes, (node) =>
            this.normalize_node(node, headers)
        );
    };

    public static gen_timestamp = (): string => {
        return DateTime.now().toUnixInteger().toString();
    };

    private static _get_default_port = (scheme: string): number => {
        return scheme == 'https' ? 443 : 9984;
    };

    private static normalize_url = (node: string): string => {
        if (!node) {
            node = this.DEFAULT_NODE;
        } else if (!node.includes('://')) {
            node = `//${node}`;
        }
        const parts = url.parse(node, true);
        const port = parts.port
            ? parts.port.toString()
            : this._get_default_port(parts.protocol || '');
        const netloc = `${parts.hostname || ''}:${port}`;
        const modifiedURL = url.format({
            protocol: parts.protocol || 'http:',
            host: netloc,
            pathname: parts.pathname || '/',
        });

        return modifiedURL;
    };

    private static normalize_node = (
        node: string | Node,
        headers: AxiosHeaders | undefined
    ): Node => {
        if (!headers) {
            headers = new AxiosHeaders();
        }
        let url;
        if (typeof node === 'string') {
            url = this.normalize_url(node);
            return { endpoint: url, headers: headers };
        }
        url = this.normalize_url(node['endpoint']);

        // MAKE SURE THIS IS NOT NEEDED

        // const node_headers = {...headers}
        return {
            endpoint: url,
            headers: new AxiosHeaders(headers),
        };
    };
}

export default NodeUtils;

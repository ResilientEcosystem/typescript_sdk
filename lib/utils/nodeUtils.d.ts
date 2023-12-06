import { AxiosHeaders } from 'axios';
import type { DictionaryObject, Node } from './types';
declare class NodeUtils {
    private static DEFAULT_NODE;
    static serialize: (data?: DictionaryObject) => string;
    static normalize_nodes: (nodes: Node[] | string[], headers: AxiosHeaders | undefined) => Node[];
    static gen_timestamp: () => string;
    private static _get_default_port;
    private static normalize_url;
    private static normalize_node;
}
export default NodeUtils;

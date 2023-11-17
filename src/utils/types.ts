import { AxiosHeaders } from 'axios';

type DictionaryObject = {
    [key: string]: any;
};

interface Node {
    endpoint: string;
    headers?: AxiosHeaders;
}

export { DictionaryObject, Node };

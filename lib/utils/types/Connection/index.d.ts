import { AxiosHeaders } from 'axios';
declare type DictionaryObject = {
    [key: string]: any;
};
declare type HttpMethodType = 'POST' | 'DELETE' | 'GET' | 'PUT';
interface Node {
    endpoint: string;
    headers?: AxiosHeaders;
}
export { DictionaryObject, HttpMethodType, Node };

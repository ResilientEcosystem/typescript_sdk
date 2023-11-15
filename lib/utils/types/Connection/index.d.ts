import { AxiosHeaders } from 'axios';
type DictionaryObject = {
    [key: string]: any;
};
type HttpMethodType = 'POST' | 'DELETE' | 'GET' | 'PUT';
interface Node {
    endpoint: string;
    headers?: AxiosHeaders;
}
export { DictionaryObject, HttpMethodType, Node };

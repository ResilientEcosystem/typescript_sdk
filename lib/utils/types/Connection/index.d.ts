type DictionaryObject = {
    [key: string]: any;
};
type HttpMethodType = 'POST' | 'DELETE' | 'GET' | 'PUT';
interface Node {
    endpoint: string;
    headers?: DictionaryObject;
}
export { DictionaryObject, HttpMethodType, Node };

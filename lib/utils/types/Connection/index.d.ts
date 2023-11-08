declare type DictionaryObject = {
    [key: string]: RequestValueTypes;
};
declare type RequestValueTypes = string | string[] | number | boolean | null;
declare type HttpMethodType = 'POST' | 'DELETE' | 'GET' | 'PUT';
interface Node {
    endpoint: string;
    headers?: DictionaryObject;
}
export { DictionaryObject, HttpMethodType, Node };

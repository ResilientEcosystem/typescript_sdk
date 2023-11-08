type DictionaryObject = {
    [key: string]: RequestValueTypes;
};

type RequestValueTypes = string | string[] | number | boolean | null;

type HttpMethodType = 'POST' | 'DELETE' | 'GET' | 'PUT'

interface Node {
    endpoint: string
    headers?: DictionaryObject
}

export { DictionaryObject, HttpMethodType, Node };

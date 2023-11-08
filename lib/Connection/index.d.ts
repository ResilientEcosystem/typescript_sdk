import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DictionaryObject, HttpMethodType } from '../utils/types/Connection';
declare class Connection {
    private readonly nodeUrl;
    private session;
    private backoffInMs;
    constructor(nodeUrl: string, headers?: DictionaryObject);
    private getSession;
    private _request;
    private getBackoffInMs;
    request(method: HttpMethodType, path: string, config?: AxiosRequestConfig<any>): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
export default Connection;

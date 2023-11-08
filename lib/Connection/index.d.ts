import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DictionaryObject, HttpMethodType } from '../utils/types/Connection';
declare class Connection {
    private readonly nodeUrl;
    private session;
    constructor(nodeUrl: string, headers?: DictionaryObject);
    private getSession;
    private _request;
    request(method: HttpMethodType, path: string, config?: AxiosRequestConfig<any>): Promise<[AxiosResponse<unknown> | void, Error | null]>;
}
export default Connection;

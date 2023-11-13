import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DictionaryObject, HttpMethodType } from '../utils/types/Connection';
interface ConnectionInterface {
    getBackoffInMs(): number;
    request(method: HttpMethodType, path: string, backoffCap: number, config?: AxiosRequestConfig<any>): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
interface ConnectionConstructor {
    new (nodeUrl: string, headers: DictionaryObject): ConnectionInterface;
}
declare var ConnectionInterface: ConnectionConstructor;
declare class Connection implements ConnectionInterface {
    private readonly nodeUrl;
    private session;
    private backoffInMs;
    constructor(nodeUrl: string, headers?: DictionaryObject);
    private getSession;
    private _request;
    getBackoffInMs(): number;
    private updateBackoffInMs;
    private delay;
    request(method: HttpMethodType, path: string, backoffCap?: number, config?: AxiosRequestConfig<any>): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
export { Connection, ConnectionInterface };

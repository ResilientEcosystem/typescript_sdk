import { AxiosHeaders, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
interface RequestConfig {
    backoffCap?: number;
    axiosConfig?: AxiosRequestConfig;
}
interface ConnectionInterface {
    getBackoffInMs(): number;
    request(method: Method, path: string, config: RequestConfig): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
interface ConnectionConstructor {
    new (nodeUrl: string, headers: AxiosHeaders): ConnectionInterface;
}
declare var ConnectionInterface: ConnectionConstructor;
declare class Connection implements ConnectionInterface {
    private readonly nodeUrl;
    private session;
    private backoffInMs;
    constructor(nodeUrl: string, headers?: AxiosHeaders);
    private getSession;
    private _request;
    getBackoffInMs(): number;
    private updateBackoffInMs;
    private delay;
    request(method: Method, path: string, requestConfig: RequestConfig): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
export { Connection, ConnectionInterface };

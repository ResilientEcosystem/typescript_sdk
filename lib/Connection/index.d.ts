import { AxiosHeaders, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
interface RequestConfig {
    backoffCap?: number;
    timeout?: number;
    axiosConfig?: AxiosRequestConfig;
}
interface ConnectionInterface {
    getBackoffInMs(): number;
    getNodeUrl(): string;
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
    getBackoffInMs(): number;
    getNodeUrl(): string;
    private delay;
    request(method: Method, path: string, requestConfig: RequestConfig): Promise<[AxiosResponse<unknown> | null, Error | null]>;
    private getSession;
    private _request;
    private updateBackoffInMs;
}
export { Connection, ConnectionInterface };

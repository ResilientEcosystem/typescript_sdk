import { PoolInterface } from '../Pool';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpMethodType, Node } from '../utils/types/Connection';
interface TransportInterface {
    nodes: Node[];
    timeoutInMs: number;
    connectionPool: PoolInterface;
    forwardRequest(method: HttpMethodType, path: string, axiosConfig?: AxiosRequestConfig<any>): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
interface TransportConstructor {
    new (nodes: Node[], timeoutInMs: number): TransportInterface;
}
declare var TransportInterface: TransportConstructor;
declare class Transport implements TransportInterface {
    nodes: Node[];
    timeoutInMs: number;
    connectionPool: PoolInterface;
    constructor(nodes: Node[], timeoutInMs?: number);
    private constructEndpoints;
    forwardRequest(method: HttpMethodType, path: string, axiosConfig?: AxiosRequestConfig<any>): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
export { Transport, TransportInterface };

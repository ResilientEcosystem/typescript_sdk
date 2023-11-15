import { PoolInterface } from '../Pool';
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { Node } from '../utils/common/types';
interface TransportInterface {
    nodes: Node[];
    timeoutInMs: number;
    connectionPool: PoolInterface;
    forwardRequest(method: Method, path: string, axiosConfig?: AxiosRequestConfig): Promise<[AxiosResponse<unknown> | null, Error | null]>;
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
    forwardRequest(method: Method, path: string, axiosConfig?: AxiosRequestConfig): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
export { Transport, TransportInterface };

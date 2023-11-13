import { Pool } from '../Pool';
import { HttpMethodType, Node } from '../utils/types/Connection';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
declare class Transport {
    nodes: Node[];
    timeoutInMs: number;
    connection_pool: Pool;
    constructor(nodes: Node[] | string[], timeoutInMs?: number);
    private construct_endpoints;
    forward_request(method: HttpMethodType, path: string, config?: AxiosRequestConfig<any>): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
export default Transport;

import { Pool } from '../Pool';
import { HttpMethodType, Node } from '../utils/types/Connection';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
declare class Transport {
    nodes: Node[];
    timeoutInMs: number;
    connectionPool: Pool;
    constructor(nodes: Node[], timeoutInMs?: number);
    private constructEndpoints;
    forwardRequest(method: HttpMethodType, path: string, axiosConfig?: AxiosRequestConfig<any>): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}
export default Transport;

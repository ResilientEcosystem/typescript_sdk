import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { DictionaryObject, HttpMethodType } from '../utils/types/Connection';

import AxiosAdapter from '../utils/common/axiosAdapter';

import logger from '../utils/common/logger';

const BACKOFF_TIMEDELTA_IN_MS = 500;

class Connection {
    private readonly nodeUrl: string;
    private session: AxiosInstance;
    private backoffInMs: number;

    public constructor(nodeUrl: string, headers: DictionaryObject = {}) {
        this.nodeUrl = nodeUrl;
        this.session = AxiosAdapter.createAxiosSession(nodeUrl, headers);
    }

    private getSession(): AxiosInstance {
        return this.session;
    }

    private async _request(
        method: string,
        path: string,
        config?: AxiosRequestConfig<any>
    ): Promise<AxiosResponse<unknown | void>> {
        const response: AxiosResponse<unknown> =
            await this.getSession().request({
                method,
                url: path,
                ...config,
            });
        return response;
    }
    private getBackoffInMs(): number {
        return this.backoffInMs;
    }

    public async request(
        method: HttpMethodType,
        path: string,
        config?: AxiosRequestConfig<any>
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        try {
            const response: AxiosResponse<unknown> = await this._request(
                method,
                path,
                config
            );
            return [response, null];
        } catch (err) {
            logger.error('Error during axios request', {
                err,
                method,
                path,
                config,
            });
            return [null, err];
        }
    }
}

export default Connection;

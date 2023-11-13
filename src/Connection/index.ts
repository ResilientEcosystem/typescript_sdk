import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { DictionaryObject, HttpMethodType } from '../utils/types/Connection';

import AxiosAdapter from '../utils/common/axiosAdapter';

import logger from '../utils/common/logger';

const BACKOFF_TIMEDELTA_IN_MS = 500;

interface ConnectionInterface {
    getBackoffInMs(): number;
    request(
        method: HttpMethodType,
        path: string,
        backoffCap: number,
        config?: AxiosRequestConfig<any>
    ): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}

interface ConnectionConstructor {
    new (nodeUrl: string, headers: DictionaryObject): ConnectionInterface;
}

declare var ConnectionInterface: ConnectionConstructor;

class Connection implements ConnectionInterface {
    private readonly nodeUrl: string;
    private session: AxiosInstance;
    private backoffInMs: number;

    public constructor(nodeUrl: string, headers: DictionaryObject = {}) {
        this.nodeUrl = nodeUrl;
        this.backoffInMs = 0;
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

    public getBackoffInMs(): number {
        return this.backoffInMs;
    }

    private updateBackoffInMs(
        isSuccess: boolean,
        backoffCapInMs: number = 0,
        numRetries: number = 0
    ): void {
        if (isSuccess) {
            this.backoffInMs = 0;
            return;
        }
        this.backoffInMs = Math.min(
            BACKOFF_TIMEDELTA_IN_MS * Math.pow(2, numRetries),
            backoffCapInMs
        );
    }

    private async delay(): Promise<void> {
        return await new Promise((r) => setTimeout(r, this.getBackoffInMs()));
    }

    public async request(
        method: HttpMethodType,
        path: string,
        backoffCap: number = 0,
        config?: AxiosRequestConfig<any>
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        await this.delay();
        let response: AxiosResponse<unknown>;
        try {
            response = await this._request(method, path, config);
            this.updateBackoffInMs(
                true,
                backoffCap,
                Number(response?.config['axios-retry']) ?? 0
            );
            return [response, null];
        } catch (err) {
            logger.error('Error during axios request', {
                err,
                method,
                path,
                config,
            });
            this.updateBackoffInMs(
                false,
                backoffCap,
                Number(response?.config['axios-retry']) ?? 0
            );
            return [null, err];
        }
    }
}

export { Connection, ConnectionInterface };

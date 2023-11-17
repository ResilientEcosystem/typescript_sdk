import {
    AxiosHeaders,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    Method,
} from 'axios';
import AxiosAdapter from '../utils/axiosAdapter';
import logger from '../utils/logger';

const BACKOFF_TIMEDELTA_IN_MS = 500;

interface RequestConfig {
    backoffCap?: number;
    timeout?: number;
    axiosConfig?: AxiosRequestConfig;
}

interface ConnectionInterface {
    getBackoffInMs(): number;
    getNodeUrl(): string;
    request(
        method: Method,
        path: string,
        config: RequestConfig
    ): Promise<[AxiosResponse<unknown> | null, Error | null]>;
}

interface ConnectionConstructor {
    new (nodeUrl: string, headers: AxiosHeaders): ConnectionInterface;
}

// ambient declaration - links ConnectionConstructor to ConnectionInterface
declare var ConnectionInterface: ConnectionConstructor;

class Connection implements ConnectionInterface {
    private readonly nodeUrl: string;
    private session: AxiosInstance;
    private backoffInMs: number;

    public constructor(
        nodeUrl: string,
        headers: AxiosHeaders = new AxiosHeaders()
    ) {
        this.nodeUrl = nodeUrl;
        this.backoffInMs = 0;
        this.session = AxiosAdapter.createAxiosSession(nodeUrl, headers);
    }

    public getBackoffInMs(): number {
        return this.backoffInMs;
    }

    public getNodeUrl(): string {
        return this.nodeUrl;
    }

    private async delay(timeoutInMs: number): Promise<void> {
        return await new Promise((r) => setTimeout(r, timeoutInMs));
    }

    public async request(
        method: Method,
        path: string,
        requestConfig: RequestConfig
    ): Promise<[AxiosResponse<unknown> | null, Error | null]> {
        await this.delay(this.getBackoffInMs());
        let response: AxiosResponse<unknown>;
        try {
            response = await this._request(
                method,
                path,
                requestConfig?.axiosConfig
            );
            this.updateBackoffInMs(
                true,
                requestConfig?.backoffCap ?? 0,
                Number(response?.config['axios-retry']) ?? 0
            );
            return [response, null];
        } catch (err) {
            logger.error('Error during axios request', {
                err,
                method,
                path,
                requestConfig,
            });
            this.updateBackoffInMs(
                false,
                requestConfig?.backoffCap ?? 0,
                Number(response?.config['axios-retry']) ?? 0
            );
            return [null, err];
        }
    }

    private getSession(): AxiosInstance {
        return this.session;
    }

    private async _request(
        method: string,
        path: string,
        axiosConfig: AxiosRequestConfig
    ): Promise<AxiosResponse<unknown | void>> {
        const response: AxiosResponse<unknown> =
            await this.getSession().request({
                method,
                url: path,
                ...axiosConfig,
            });
        return response;
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
}

export { Connection, ConnectionInterface };

import axios, { AxiosHeaders, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

class AxiosAdapter {
    static createAxiosSession(
        baseURL: string,
        headers: AxiosHeaders
    ): AxiosInstance {
        const session: AxiosInstance = axios.create({
            baseURL,
            headers,
            timeout: 10000,
        });

        axiosRetry(session, {
            retries: 3, // Maximum number of retries
            retryDelay: axiosRetry.exponentialDelay, // Exponential delay between retries
            retryCondition: (error) => {
                return (
                    (axiosRetry.isNetworkError(error) ||
                        (error.response && error.response.status === 500)) ??
                    false
                );
            },
        });

        return session;
    }
}

export default AxiosAdapter;

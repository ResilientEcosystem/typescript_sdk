import { AxiosHeaders, AxiosInstance } from 'axios';
declare class AxiosAdapter {
    static createAxiosSession(baseURL: string, headers: AxiosHeaders): AxiosInstance;
}
export default AxiosAdapter;

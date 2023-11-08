import { AxiosInstance } from 'axios';
import { DictionaryObject } from '../types/Connection';
declare class AxiosAdapter {
    static createAxiosSession(baseURL: string, headers: DictionaryObject): AxiosInstance;
}
export default AxiosAdapter;

import { AxiosRequestConfig, AxiosPromise } from 'axios';
interface RequestConfig {
    dataType: 'json' | any;
    responseType: 'text' | 'arrayBuffer';
    enableHttp2: boolean;
    enableHttpDNS: boolean;
    enableQuic: boolean;
    enableCache: boolean;
    mode: 'same-origin' | 'cors' | 'no-cors';
    credentials: 'omit' | 'include' | 'same-origin';
}
declare type RequestConfigKeys = 'baseURL' | 'url' | 'method' | 'data' | 'params' | 'headers' | 'timeout' | 'adapter' | 'paramsSerializer' | 'transformRequest' | 'transformResponse' | 'validateStatus';
export declare type TaroRequestConfig = Pick<AxiosRequestConfig, RequestConfigKeys> & RequestConfig;
export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    config: TaroRequestConfig;
    headers: any;
    request: any;
    profile: {
        [propName: string]: any;
    };
}
export default function createAdapter(customRequest: any): (config: TaroRequestConfig) => AxiosPromise;
export {};

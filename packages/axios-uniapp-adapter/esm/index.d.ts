import { AxiosRequestConfig, AxiosPromise } from 'axios';
interface RequestConfig {
    dataType: 'json' | any;
    responseType: 'text' | 'arrayBuffer';
    enableHttp2: boolean;
    enableHttpDNS: boolean;
    enableQuic: boolean;
    enableCache: boolean;
}
declare type RequestConfigKeys = 'baseURL' | 'url' | 'method' | 'data' | 'params' | 'headers' | 'timeout' | 'adapter' | 'paramsSerializer' | 'transformRequest' | 'transformResponse' | 'withCredentials' | 'validateStatus';
export declare type UniappRequestConfig = Pick<AxiosRequestConfig, RequestConfigKeys> & RequestConfig;
export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    config: UniappRequestConfig;
    headers: any;
    request: any;
    profile: {
        [propName: string]: any;
    };
}
export default function createAdapter(customRequest: any): (config: UniappRequestConfig) => AxiosPromise;
export {};

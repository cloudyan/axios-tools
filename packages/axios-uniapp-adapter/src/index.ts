// https://github.com/axios/axios/blob/master/lib/adapters/README.md#axios--adapters
// https://uniapp.dcloud.net.cn/api/request/request.html

import {
  AxiosRequestConfig,
  AxiosPromise,
  // AxiosResponse,
} from 'axios';

// import url from 'url'
// import utils from 'axios/lib/utils'
// import settle from 'axios/lib/core/settle';
// import cookies from 'axios/lib/helpers/cookies'
import buildURL from 'axios/lib/helpers/buildURL';
import buildFullPath from 'axios/lib/core/buildFullPath';
// import parseHeaders from 'axios/lib/helpers/parseHeaders'
// import isURLSameOrigin from 'axios/lib/helpers/isURLSameOrigin'
// import transitionalDefaults from 'axios/lib/defaults/transitional'
import AxiosError from 'axios/lib/core/AxiosError';
// import CanceledError from 'axios/lib/cancel/CanceledError'
// import parseProtocol from 'axios/lib/helpers/parseProtocol'

type RequestMethod =
  | 'GET'
  | 'POST' // 其他小程序支持有限
  | 'OPTIONS'
  | 'HEAD'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT';

interface RequestConfig {
  dataType: 'json' | any;
  responseType: 'text' | 'arrayBuffer';
  enableHttp2: boolean;
  enableHttpDNS: boolean;
  enableQuic: boolean;
  enableCache: boolean;

  // jsonp: boolean
  // mode: 'same-origin'
  // credentials: 'omit'
  // retryTimes: number
  // cache: 'default'
}

type RequestConfigKeys =
  | 'baseURL'
  | 'url'
  | 'method'
  | 'data'
  | 'params'
  | 'headers'
  | 'timeout'
  | 'adapter'
  | 'paramsSerializer'
  | 'transformRequest'
  | 'transformResponse'
  | 'withCredentials' // 仅 H5
  | 'validateStatus';

export type UniappRequestConfig = Pick<AxiosRequestConfig, RequestConfigKeys> &
  RequestConfig;

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

export default function createAdapter(customRequest: any) {
  const request = customRequest;
  return function myAdapter(config: UniappRequestConfig): AxiosPromise {
    // At this point:
    //  - config has been merged with defaults
    //  - request transformers have already run
    //  - request interceptors have already run

    // Make the request using config provided
    // Upon response settle the Promise

    return new Promise(function (resolve, reject) {
      // let requestTask;
      const requestData = config.data;
      const requestHeaders = config.headers;
      const requestMethod = (config.method || 'GET').toUpperCase();
      const fullPath = buildFullPath(config.baseURL, config.url);

      const requestOptions = Object.assign({}, config, {
        url: buildURL(fullPath, config.params, config.paramsSerializer),
        data: requestData,
        method: requestMethod as RequestMethod,
        header: requestHeaders, // uniapp 使用的 header
        complete: (httpResponse: any) => {
          console.log('origin uniapp httpConfig', config);
          console.log('origin uniapp httpResponse', httpResponse);

          // net::ERR_PROXY_CONNECTION_FAILED {errMsg: 'request:fail '}

          // const status = httpResponse.statusCode || httpResponse.status
          const response = {
            data: httpResponse.data, // apiResponse
            status: httpResponse.statusCode || httpResponse.status,
            statusText: httpResponse.errMsg || '',
            headers: httpResponse.header || httpResponse.headers,
            config: config,
            profile: httpResponse.profile,
            request,
          } as AxiosResponse;
          settle(resolve, reject, response);

          // if ([11, 12, 13, 14, 19, 20].indexOf(err.statusCode) > -1) {}
          // request:fail abort
          // timeout
          // {status: undefined, statusText: 'request:fail '}
        },
      });

      const requestTask = request(requestOptions);

      // From here:
      //  - response transformers will run
      //  - response interceptors will run
    });
  };
}

// 需要确认返回的数据格式
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;

  // TODO: 有可能 response.status 不存在，API 服务不通时
  // if (typeof response.status === 'undefined') {
  // }
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(
      new AxiosError(
        'Request failed with status code ' + response.status,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][
          Math.floor(response.status / 100) - 4
        ],
        response.config,
        response.request,
        response,
      ),
    );
  }
}

// 默认的 config.validateStatus
// function validateStatus(status) {
//   return status >= 200 && status < 300;
// }

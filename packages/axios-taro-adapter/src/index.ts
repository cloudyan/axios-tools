
// https://github.com/axios/axios/blob/master/lib/adapters/README.md#axios--adapters
// https://taro-docs.jd.com/taro/docs/apis/network/request/

// import url from 'url'
import {
  AxiosRequestConfig,
  AxiosPromise,
  // AxiosResponse,
} from 'axios'
// import utils from 'axios/lib/utils'
import settle from 'axios/lib/core/settle'
// import cookies from 'axios/lib/helpers/cookies'
import buildURL from 'axios/lib/helpers/buildURL'
import buildFullPath from 'axios/lib/core/buildFullPath'
// import parseHeaders from 'axios/lib/helpers/parseHeaders'
// import isURLSameOrigin from 'axios/lib/helpers/isURLSameOrigin'
// import transitionalDefaults from 'axios/lib/defaults/transitional'
// import AxiosError from 'axios/lib/core/AxiosError'
// import CanceledError from 'axios/lib/cancel/CanceledError'

type RequestMethod =
  | 'GET'
  | 'POST' // 其他小程序支持有限
  | 'OPTIONS'
  | 'HEAD'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT'

interface RequestConfig {
  dataType: 'json' | any
  responseType: 'text' | 'arrayBuffer'
  enableHttp2: boolean
  enableHttpDNS: boolean
  enableQuic: boolean
  enableCache: boolean

  // jsonp: boolean
  mode: 'same-origin' | 'cors' | 'no-cors' // 仅 H5
  credentials: 'omit' | 'include' | 'same-origin' // 仅 H5
  // retryTimes: number
  // cache: 'default'
}

// credentials, // Taro 底层是 fetch, 不同于 withCredentials, 取值枚举 include same-origin omit
// Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'Window': Failed to read the 'credentials' property from 'RequestInit': The provided value 'false' is not a valid enum value of type RequestCredentials.

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
  | 'validateStatus'

export type TaroRequestConfig = Pick<AxiosRequestConfig, RequestConfigKeys> &
  RequestConfig

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  config: TaroRequestConfig
  headers: any
  request: any
  profile: {
    [propName: string]: any
  }
}

export default function createAdapter(customRequest: any){
  const request = customRequest
  return function myAdapter(config: TaroRequestConfig): AxiosPromise {
    // At this point:
    //  - config has been merged with defaults
    //  - request transformers have already run
    //  - request interceptors have already run

    // Make the request using config provided
    // Upon response settle the Promise

    return new Promise(function(resolve, reject) {
      let requestTask
      const requestData = config.data
      const requestHeaders = config.headers
      const requestMethod = (config.method || 'GET').toUpperCase()
      const fullPath = buildFullPath(config.baseURL, config.url)

      const requestOptions = Object.assign({}, config, {
        url: buildURL(fullPath, config.params, config.paramsSerializer),
        data: requestData,
        method: requestMethod as RequestMethod,
        header: requestHeaders, // uniapp 使用的 header
        complete: (res: any) => {
          // const status = res.statusCode || res.status
          const response = {
            data: res.data,
            status: res.statusCode || res.status,
            statusText: res.errMsg || '',
            headers: res.header || res.headers,
            config: config,
            profile: res.profile,
            request,
          } as AxiosResponse
          settle(resolve, reject, response);

          // if ([11, 12, 13, 14, 19, 20].indexOf(err.statusCode) > -1) {}
          // request:fail abort
          // timeout
        },
      })

      requestTask = request(requestOptions)

      // From here:
      //  - response transformers will run
      //  - response interceptors will run
    })
  }
}

// 需要确认返回的数据格式
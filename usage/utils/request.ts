
/**
 * 业务封装
 *
 * 拦截器不要返回数据，依然返回 AxiosResponse 对象
 *
 */

import Axios, { AxiosRequestConfig } from 'axios'
import axiosRetry from 'axios-retry'
import jsonpAdapter from 'axios-jsonp'
import conf from '../config'

console.log('conf', conf)

// 使用 taroAdapter
// import Taro from '@tarojs/taro'
// import createTaroAdapter from './axios-taro-adapter'
// import Taro from '@tarojs/taro'

// axios.defaults.adapter = createTaroAdapter(Taro.request)


// 你的配置
const instance = axios.create({
  baseURL: conf.apiBaseURL,
})

// 设置token
// instance.defaults.headers.common['Authorization'] = 'I am a token';

// 安装 retry 插件
// 当请求失败后，自动重新请求，只有3次失败后才真正失败
axiosRetry(instance, { retries: 3 })

// 本地调试 H5
if (process.env.NODE_ENV === 'development') {
  instance.interceptors.request.use(config => {
    if (!/^https?/.test(config.url)) {
      config.url = [conf.prefix || '', config.url].join('')
    }
    return config
  })
}


// 拦截器返回数据是 ❌ 用法，使用后，导致后续很难再扩展（使用其他拦截器, 适配器等）
// client.interceptors.response.use(response => {
//   return response.data
// })
// 推荐使用函数代替拦截器 ✅
export async function request(url: string, config?: AxiosRequestConfig) {
  const response = await instance.request({ url, ...config })
  const result = response.data
  // 你的业务判断逻辑
  return result
}

export function jsonp(url: string, config?: AxiosRequestConfig) {
  return request(url, { ...config, adapter: jsonpAdapter })
}


const CancelToken = Axios.CancelToken
export function withCancelToken(fetcher) {
  let abort

  function send(data, config) {
    cancel() // 主动取消

    const cancelToken = new CancelToken(cancel => (abort = cancel))
    return fetcher(data, { ...config, cancelToken })
  }

  function cancel(message = 'abort') {
    if (abort) {
      abort(message)
      abort = null
    }
  }

  return [send, cancel]
}

export default instance




// 实现版本控制
// instance.interceptors.request.use(config => {
//   config.url = config.url.replace('{version}', 'v1')
//   return config
// })
// GET /api/v1/users
// request('/api/{version}/users')

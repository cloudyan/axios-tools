/**
 * 业务封装
 *
 * 响应拦截器不要返回api 数据，依然返回 AxiosResponse 对象
 *
 */

import axios, { AxiosRequestConfig } from 'axios';
// import Taro from '@tarojs/taro';
// import axiosRetry from 'axios-retry'
// import jsonpAdapter from 'axios-jsonp'
import conf from '@/config/index';

console.log('conf', conf);

// axios.defaults.adapter = createTaroAdapter(Taro.request)

// 你的配置
const instance = axios.create({
  baseURL: conf.apiBaseUrl,
});

// 设置token
// instance.defaults.headers.common['Authorization'] = 'I am a token';

// 安装 retry 插件
// 当请求失败后，自动重新请求，只有3次失败后才真正失败
// axiosRetry(instance, { retries: 3 })

// 本地调试 H5
if (process.env.NODE_ENV === 'development') {
  instance.interceptors.request.use((config) => {
    if (!/^https?/.test(config.url || '')) {
      config.url = [conf.apiPrefix || '', config.url].join('');
    }
    return config;
  });
}

// 拦截器返回数据是 ❌ 用法，使用后，导致后续很难再扩展（使用其他拦截器, 适配器等）
// client.interceptors.response.use(response => {
//   return response.data
// })

// 推荐使用函数代替拦截器 ✅
export async function request(config?: AxiosRequestConfig) {
  // 你的业务逻辑封装
  // return instance.request(config)
  //   .then((res) => formatResolveData(res))
  //   .catch((err) => formatRejectData(err))

  const formatRes = {
    data: {},
    code: -1, // 表示没有解析到code
    msg: '',
    error: true,
  };

  // 兼容各种api返回  返回统一格式
  await instance
    .request(config)
    // .then(res: axiosResponse => res)
    .catch((err) => err)
    .then((res) => {
      // 请求成功 读取res 本质为 axiosResponse
      // 请求失败 读取res?.response
      console.log('request:');
      const { data, status, statusText } = res?.isAxiosError
        ? res?.response || {}
        : res;

      formatRes.data = data || {};
      formatRes.code = data?.code || status || -1;

      // 网络层 出问题
      if (res?.isAxiosError) {
        formatRes.msg = data?.message || '网络异常，请稍后重试';
        formatRes.error = true;
      } else {
        // 网络层没问题 看看业务层 判断api是否有问题
        formatRes.msg = data?.message || '';
        formatRes.error = Boolean(data?.code);
      }
      return res;
    })
    .catch((err) => {
      formatRes.msg = '数据解析异常，请稍后重试';
      console.error('Parse Api Response Error:', err);
      return err;
    });

  // 触发登录
  if (formatRes.code === conf.authCode) {
    // goLogin();
    return;
  }

  // api 错误提示
  // if (formatRes.error && !config.ignoreErrHandle) {
  //   if (Number(formatRes.data?.errorLevel) === 1) {
  //     // 触发全局modal显示
  //     Taro.eventCenter.trigger(Taro.Current?.page?.route, {
  //       msg: formatRes.msg,
  //     });
  //   } else {
  //     formatRes?.msg &&
  //       Taro.showToast({
  //         title: formatRes.msg,
  //         icon: 'none',
  //         mask: true,
  //       });
  //   }
  // }

  return formatRes;
}

// export function jsonp(url: string, config?: AxiosRequestConfig) {
//   return request(url, { ...config, adapter: jsonpAdapter })
// }

// 使用 CancelToken
const CancelToken = axios.CancelToken;
export function withCancelToken(fetcher) {
  let abort;

  function send(data, config) {
    cancel(); // 主动取消

    const cancelToken = new CancelToken((cancel) => (abort = cancel));
    return fetcher(data, { ...config, cancelToken });
  }

  function cancel(message = 'abort') {
    if (abort) {
      abort(message);
      abort = null;
    }
  }

  return [send, cancel];
}

// 使用 AbortController 控制
const controller = new AbortController();
export function withAbortController(fetcher) {
  // let abort;

  function send(data, config) {
    controller.abort(); // 主动取消

    return fetcher(data, {
      ...config,
      signal: controller.signal,
    });
  }

  return [send, controller.abort];
}

export default instance;

// 实现版本控制
// instance.interceptors.request.use(config => {
//   config.url = config.url.replace('{version}', 'v1')
//   return config
// })
// GET /api/v1/users
// request('/api/{version}/users')

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/common/storage';

/** 封装axios的实例，方便多个url时的封装 */
export const createAxiosIntance = (baseURL: string): AxiosInstance => {
  const request = axios.create({ baseURL });
  // 请求拦截器器
  request.interceptors.request.use((config: AxiosRequestConfig) => {
    config.headers['Authorization'] = tokenStorage.getItem();
    return config;
  });
  // 响应拦截器
  request.interceptors.response.use(
    (response) => {
      const code = response.data.code;
      switch (code) {
        case 0:
          return response.data;
        case 401:
          // 登录失效逻辑
          return response.data || {};
        default:
          return response.data || {};
      }
    },
    (error) => {
      // 接口请求报错时，也返回对象，这样使用async/await就不需要加try/catch
      // code为0为请求正常，不为0为请求异常,使用message提示
      return { message: onErrorReason(error.message) };
    },
  );
  return request;
};

/** 解析http层面请求异常原因 */
function onErrorReason(message: string): string {
  if (message.includes('Network Error')) {
    return '网络异常，请检查网络情况!';
  }
  if (message.includes('timeout')) {
    return '请求超时，请重试!';
  }
  return '服务异常,请重试!';
}

export const request = createAxiosIntance('');

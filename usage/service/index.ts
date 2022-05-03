import { AxiosRequestConfig } from 'axios';
import { request, jsonp, withCancelToken } from '../utils/request';

export function getUser(id: string, config?: AxiosRequestConfig) {
  return request(`api/user/${id}`, config);
}

export function getConfig(params = {}) {
  return request({
    url: '/common/initconfig',
    method: 'GET',
    params,
  });
}

// 保持请求唯一
// 包装请求函数
const [fetchUser, abortRequest] = withCancelToken(getUser);

// 发送请求
// 如果上一次请求还没回来，会被自动取消
fetchUser('1000');

// 通常不需要主动调用
// 但可以在组件销毁的生命周期中调用
abortRequest();

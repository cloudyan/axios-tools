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

// 1. 使用 CancelToken 包装请求函数
// 保持请求唯一
const [fetchUser, abortRequest] = withCancelToken(getUser);

// 发送请求
// 如果上一次请求还没回来，会被自动取消（问：自动取消是期望的吗？）
fetchUser('1000');

// 通常不需要主动调用
// 但可以在组件销毁的生命周期中调用
abortRequest();

// 2. 使用 AbortController
const controller = new AbortController();

axios
  .get('/foo/bar', {
    signal: controller.signal,
  })
  .then(function (response) {
    //...
  });
// 取消请求
controller.abort();

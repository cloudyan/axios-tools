# axios-tools

axios 工具箱

功能列表

- axios-taro-adapter
- axios-uniapp-adapter
- axios-retry-adapter-enhancer
- axios-throttle-adapter-enhancer
- axios-cache-adapter-enhancer
- axios-session-adapter-enhancer
- axios-fetch-adapter

除了适配器之外，还有请求优化相关的逻辑，功能场景如下：

1. 重复请求
2. 高频请求结果缓存
3. 请求状态自动管理
4. 请求失败重试
5. 请求参数加密
6. 自动刷新 token
7. 弱网如何处理请求
8. 跨页面操作、刷新数据

custom adapter

```ts
// https://github.com/axios/axios/blob/master/lib/adapters/README.md#axios--adapters

import settle from 'axios/lib/core/settle';

export default function createAdapter(customRequest: any) {
  const request = customRequest;

  return function myAdapter(config) {
    // At this point:
    //  - config has been merged with defaults
    //  - request transformers have already run
    //  - request interceptors have already run

    // Make the request using config provided
    // Upon response settle the Promise

    return new Promise(function (resolve, reject) {
      // example
      // var requestData
      // var request = new XMLHttpRequest();

      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request,
      };

      settle(resolve, reject, response);

      // From here:
      //  - response transformers will run
      //  - response interceptors will run
    });
  };
}
```

# axios-tools

axios 工具箱

### 功能列表

```bash
./
├── axios-cache # 响应缓存
├── axios-cancel # 取消(中止)请求
├── axios-debounce # 防抖 等待前面请求完成
├── axios-env # 规范多环境配置
├── axios-loading # 全局 loading
├── axios-merge # 重复请求合并，仅请求一次
├── axios-logger # 日志采集
├── axios-mock # mock 请求
├── axios-refresh-token # 自动刷新失效 token
├── axios-retry # 失败重试
├── axios-send-beacon # 封装 sendBeacon
├── axios-sign # 参数签名/加密
├── axios-throttle # 节流 保留第一次
├── axios-fetch-adapter
├── axios-mini-adapter
├── axios-taro-adapter
└── axios-uniapp-adapter
```

### 适配器

- axios-fetch-adapter fetch 适配器
- axios-mini-adapter 小程序适配器
- axios-taro-adapter
- axios-uniapp-adapter

除了以上功能，还有请求优化相关的逻辑，功能场景如下：

1. 弱网如何处理请求
2. 跨页面操作、刷新数据

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

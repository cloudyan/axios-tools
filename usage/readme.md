# 封装 axios

注意[小程序网络请求](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)存在以下情况

- 默认超时时间和最大超时时间都是 60s; 超时时间可以在 app.json 或 game.json 中通过 networktimeout 配置。
- wx.request、wx.uploadFile、wx.downloadFile 的最大并发限制是 10 个
- 只要成功接收到服务器返回，无论 statusCode 是多少，都会进入 success 回调

## 请求配置参数

### [axios requestOptions](https://axios-http.com/zh/docs/req_config)

```js
{
  url: '/user',
  method: 'get',
  baseURL: 'https://some-domain.com/api/',
  headers: {'X-Requested-With': 'XMLHttpRequest'}, // 应为 headers
  params: {
    ID: 12345
  },
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },
  data: {
    firstName: 'Fred'
  },
  timeout: 0, // 单位毫秒, 默认值是 `0` (永不超时)
  withCredentials: false, // 跨域使用凭证, 默认 false
  responseType: 'json', // 默认值
  xsrfCookieName: 'XSRF-TOKEN', // 默认值, xsrf token 的值，被用作 cookie 的名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认值, 带有 xsrf token 值的http 请求头名称
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },
}
```

### [uniapp requestOptions](https://uniapp.dcloud.net.cn/api/request/request.html)

**data 数据说明**

最终发送给服务器的数据是 `String` 类型，如果传入的 `data` 不是 `String` 类型，会被转换成 `String`。转换规则如下：

- 对于 `GET` 方法，会将数据转换为 `query string`。例如 `{ name: 'name', age: 18 }` 转换后的结果是 `name=name&age=18`。
- 对于 `POST` 方法且 `header['content-type']` 为 `application/json` 的数据，会进行 `JSON` 序列化。
- 对于 `POST` 方法且 `header['content-type']` 为 `application/x-www-form-urlencoded` 的数据，会将数据转换为 `query string`。

```js
{
  url: '',
  data: {},
  header: {
    'content-type': 'application/json', // content-type 默认是 application/json
  },
  method: 'GET',
  timeout: 60000,
  dataType: 'json',
  responseType: 'text',
  withCredentials: false,
  success: (res) => {},
  fail: (err) => {},
  complete: (err) => {},
}

// 成功返回
{
  data: {}, // Object/String/ArrayBuffer
  statusCode: Number, // HTTP 状态码
  header: {},
  cookies: Array.<string>
}
// 错误返回
{
  error: 12,
  errorMessage: '',
}
```

`uni.request` 返回 `requestTask`, 可以 `requestTask.abort()`

**关于 [uploadFile](https://uniapp.dcloud.net.cn/api/request/network-file.html)**

将本地资源上传到开发者服务器，客户端发起一个 POST 请求，其中 `content-type` 为 `multipart/form-data`

```js
{
  url: String,
  files: [], // 需要上传的文件列表。使用 files 时，filePath 和 name 不生效。与 filePath 二选一
    // [{name: String, file: File, uri: String}]
  filePath: String, // 要上传文件资源的路径
  name: String, // 文件对应的 key
  fileType: String, // 仅支付宝小程序 'image/video/audio',
  file: File, // 仅 H5
  formData: Object,
  success: (res) => {},
  fail: (err) => {},
  complete: (res) => {},
}

// success 返回
{
  data: String,
  statusCode: Number, // HTTP 状态码
}
```

`uni.uploadFile` 返回 `uploadTask`, 可监听上传进度变化事件，以及取消上传任务。

### [taro requestOptions](https://taro-docs.jd.com/taro/docs/apis/network/request/)

```js
{
  url: '',
  data: {},
  header: {},
  timeout: 0,
  method: 'GET',
  dataType: '',
  responseType: '',

  enableHttp2: false,
  enableHttpDNS: false,
  httpDNSServiceId: false,
  enableChunked: false,
  success: (res) => {},
  fail: (err) => {},
  complete: (res) => {},
  jsonp: false,
  mode: 'same-origin',
  credentials: 'omit',
  cache: 'default',
  retryTimes: 2,
  dataCheck: () => {},
  backup: [],
  useStore: false,
}

// 返回数据
{
  data: {},
  header: {},
  statusCode: Number, // HTTP 状态码
  errMsg: String,
  cookies: string[]
}
```

关于 [uploadFile](https://taro-docs.jd.com/taro/docs/apis/network/upload/uploadFile)

```js
{
  url: String,
  filePath: String,
  name: String,
  header: {},
  formData: {},
  timeout: number,
  fileName: String, // 仅 H5
  complete: (res) => {},
  success: (res) => {},
  fail: (err) => {},
}

// 返回数据
{
  data: String,
  statusCode: number,
  errMsg: String,
}
```

## AxiosResponse 对象

拦截器不要返回数据，依然返回 AxiosResponse 对象

```js
{
  // `data` 由服务器提供的响应
  data: {},

  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',

  // `headers` 是服务器响应头
  // 所有的 header 名称都是小写，而且可以使用方括号语法访问
  // 例如: `response.headers['content-type']`
  headers: {},

  // `config` 是 `axios` 请求的配置信息
  config: {},

  // `request` 是生成此响应的请求
  // 在node.js中它是最后一个ClientRequest实例 (in redirects)，
  // 在浏览器中则是 XMLHttpRequest 实例
  request: {}
}

// 错误返回
Error: {
  name: String,
  message: String,
  code: String, // ErrCode
  config: {},
  request: {},
  response: {},
}
```

## 自定义 adapter

```js
// https://github.com/axios/axios/blob/master/lib/adapters/README.md#axios--adapters

import settle from 'axios/lib/core/settle'

export default function myAdapter(config) {
  // At this point:
  //  - config has been merged with defaults
  //  - request transformers have already run
  //  - request interceptors have already run

  // Make the request using config provided
  // Upon response settle the Promise

  return new Promise(function(resolve, reject) {
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
}
```

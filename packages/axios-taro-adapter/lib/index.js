// https://github.com/axios/axios/blob/master/lib/adapters/README.md#axios--adapters
// https://taro-docs.jd.com/taro/docs/apis/network/request/
// import utils from 'axios/lib/utils'
import settle from 'axios/lib/core/settle';
// import cookies from 'axios/lib/helpers/cookies'
import buildURL from 'axios/lib/helpers/buildURL';
import buildFullPath from 'axios/lib/core/buildFullPath';
export default function createAdapter(customRequest) {
  var request = customRequest;
  return function myAdapter(config) {
    // At this point:
    //  - config has been merged with defaults
    //  - request transformers have already run
    //  - request interceptors have already run
    // Make the request using config provided
    // Upon response settle the Promise
    return new Promise(function (resolve, reject) {
      var requestTask;
      var requestData = config.data;
      var requestHeaders = config.headers;
      var requestMethod = (config.method || 'GET').toUpperCase();
      var fullPath = buildFullPath(config.baseURL, config.url);
      var requestOptions = Object.assign({}, config, {
        url: buildURL(fullPath, config.params, config.paramsSerializer),
        data: requestData,
        method: requestMethod,
        header: requestHeaders,
        complete: function (res) {
          // const status = res.statusCode || res.status
          var response = {
            data: res.data,
            status: res.statusCode || res.status,
            statusText: res.errMsg || '',
            headers: res.header || res.headers,
            config: config,
            profile: res.profile,
            request: request,
          };
          settle(resolve, reject, response);
          // if ([11, 12, 13, 14, 19, 20].indexOf(err.statusCode) > -1) {}
          // request:fail abort
          // timeout
        },
      });
      requestTask = request(requestOptions);
      // From here:
      //  - response transformers will run
      //  - response interceptors will run
    });
  };
}
// 需要确认返回的数据格式
//# sourceMappingURL=index.js.map

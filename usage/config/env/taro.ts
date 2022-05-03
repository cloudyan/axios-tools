// 条件编译
// https://taro-docs.jd.com/taro/docs/envs
// if (process.env.TARO_ENV === 'weapp') {
//   require('path/to/weapp/name')
// } else if (process.env.TARO_ENV === 'h5') {
//   require('path/to/h5/name')
// }

import env from '.';

let config = Object.assign({}, env, {
  appid: '',
  name: '',
  version: '',
  platform: '',
});

// weapp / swan / alipay / tt / qq / jd / h5 / rn
if (process.env.TARO_ENV === 'h5') {
  Object.assign(config, {
    appid: '',
    channel: 'h5',
    version: '1.0.0',
    platform: 'h5',
  });
} else if (process.env.TARO_ENV === 'weapp') {
  Object.assign(config, {
    appid: '',
    channel: 'weapp',
    version: '1.0.0',
    platform: 'weapp',
  });
} else if (process.env.TARO_ENV === 'alipay') {
  Object.assign(config, {
    appid: '',
    channel: 'aliapp',
    version: '1.0.0',
    platform: 'aliapp',
  });
} else if (process.env.TARO_ENV === 'swan') {
  Object.assign(config, {
    appid: '',
    channel: 'bdapp',
    version: '1.0.0',
    platform: 'bdapp',
  });
} else if (process.env.TARO_ENV === 'tt') {
  Object.assign(config, {
    appid: '',
    channel: 'ttapp',
    version: '1.0.0',
    platform: 'ttapp',
  });
} else if (process.env.TARO_ENV === 'qq') {
  Object.assign(config, {
    appid: '',
    channel: 'qqapp',
    version: '1.0.0',
    platform: 'qqapp',
  });
} else if (process.env.TARO_ENV === 'jd') {
  Object.assign(config, {
    appid: '',
    channel: 'jdapp',
    version: '1.0.0',
    platform: 'jdapp',
  });
}

export default config;

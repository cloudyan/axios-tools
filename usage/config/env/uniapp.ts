
// 条件编译
// https://uniapp.dcloud.net.cn/tutorial/platform.html#preprocessor
// #ifdef H5 || MP-WEIXIN
// 需条件编译的代码
// #endif

import env from '.'

let config = Object.assign({}, env, {
  appid: '',
  name: '',
  version: '',
  platform: '',
})

// #ifdef MP-WEIXIN
Object.assign(config, {
  appid: '',
  channel: 'weapp',
  version: '1.0.0',
  platform: 'weapp',
})
// #endif

// #ifdef MP-ALIPAY
Object.assign(config, {
  appid: '',
  channel: 'aliapp',
  version: '1.0.0',
  platform: 'aliapp',
})
// #endif

// #ifdef MP-BAIDU
Object.assign(config, {
  appid: '',
  channel: 'bdapp',
  version: '1.0.0',
  platform: 'bdapp',
})
// #endif

// #ifdef MP-TOUTIAO
Object.assign(config, {
  appid: '',
  channel: 'ttapp',
  version: '1.0.0',
  platform: 'ttapp',
})
// #endif

// #ifdef MP-TINGTALK
Object.assign(config, {
  appid: '',
  channel: 'ddapp',
  version: '1.0.0',
  platform: 'ddapp',
})
// #endif

export default config

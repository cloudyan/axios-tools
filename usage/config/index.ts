type ENVKey = 'local' | 'dev' | 'sit' | 'prod';
type ENVConfig = {
  [key in ENVKey]: {
    host?: string;
    baseUrl?: string;
    apiBaseUrl?: string;
    apiPrefix?: string;
    trackUrl: string;
  };
};

const apiEnv: ENVKey = 'sit'; // local dev sit prod
const baseEnv = {
  appVersion: '3.0.0',
  authCocde: 401, // 未登录的错误码
  // ...config,
  baseUrl: '',
  apiBaseUrl: '',
  apiPrefix: '',
  defaultShareInfo: {
    title: '我分享了xxx给你，快来看看吧',
    content: '大额优惠等你来',
    desc: '大额优惠等你来',
    imageUrl: '',
  },
  utm: {
    // utm 参数
    // channel: config.channel,
    source: '',
    media: '',
  },
};

const ENV: ENVConfig = {
  prod: {
    host: 'm.xxx.com',
    baseUrl: 'https://m.xxx.com',
    apiBaseUrl: 'https://m.xxx.com',
    trackUrl: 'https://m.api.xxx.com',
  },
  local: {
    apiPrefix: '/api',
    baseUrl: 'http://localhost:8085',
    apiBaseUrl: 'https://m.sit.xxx.com',
    trackUrl: 'https://m.sit.xxx.com',
  },
  dev: {
    // dev 尚未支持
    baseUrl: 'https://m.dev.xxx.com',
    apiBaseUrl: 'https://m.dev.xxx.com',
    trackUrl: 'https://m.dev.xxx.com',
  },
  sit: {
    baseUrl: 'https://m.sit.xxx.com',
    apiBaseUrl: 'https://m.sit.xxx.com',
    trackUrl: 'https://m.sit.xxx.com',
  },
};

if (apiEnv === 'local') {
  // #ifndef H5
  if (process.env.TARO_ENV !== 'h5') {
    // 小程序不需要 apiPrefix
    ENV.local.apiPrefix = '';
  } else {
    // H5 走 proxy 代理，不需要 apiBaseUrl
    ENV.local.apiBaseUrl = '';
  }
  // #endif
}

function createEnv(current: ENVKey = 'prod') {
  return Object.assign({}, baseEnv, ENV[current], {
    stage: current,
  });
}

const envResult = createEnv(apiEnv);

export default envResult;

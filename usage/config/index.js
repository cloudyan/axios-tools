import Taro from '@tarojs/taro'

let env = 'dev' // local dev sit pre prod

const envs = {
  dev: {
    prefix: Taro.getEnv() === Taro.ENV_TYPE.WEB ? '/api' : '',
    apiBaseURL: Taro.getEnv() === Taro.ENV_TYPE.WEB ? '' : 'https://m.api.haoshiqi.net',
    // prefix: '',
    // apiBaseURL: '',
  },
  sit: {
    apiBaseURL: '',
  },
  pre: {
    apiBaseURL: '',
  },
  prod: {
    prefix: '',
    apiBaseURL: '',
  },
}

const defaultConfig = {
  prefix: '',
  apiBaseURL: '',
}

function getEnv(current = 'prod') {
  return Object.assign({}, defaultConfig, envs[current])
}

export default getEnv(env)

# 基础配置

- apiEnv 配置 local dev sit prod
- mode 模式配置 development production
- platform 平台配置 %PLATFORM%
  - `#ifdef %PLATFORM%`
  - `#endif`

```js
// - 微信小程序 weapp
// - 微信公众号 wechat
// - 支付宝小程序 aliapp
// - 支付宝生活号 alipay
// - 饿了么 elm
```

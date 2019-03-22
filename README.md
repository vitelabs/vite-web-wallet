# vite-web-wallet (SPA)

## PreRequires

* yarn

## Building (webpack)

`yarn run build`

## Starting

1. `yarn install`
2. `yarn run dev`

### Branch naming rules

* Develop on branch `dev/{version}/{function name}`
* Test on branch `test`
* Fixed version on branch `dev/{version}`
* Production branch `production`

> Notice: development branch split from `dev/{last_version}`. If `dev/{last_version}` is not exist, split from `master`

#### Examples

`'dev/2.0.0/utf8' from 'dev/1.0.0' || 'master'`

### 路由规则

以`src/pages`下的文件路径为规则自动生成路由（只有文件夹内有index.vue才会生成路由）
可以在`src/router/config.js`中定义路由别名

#### Examples

`src/pages/exchange/openOrders/index.vue` => `/exchangeOpenOrders`

# vite-web-wallet (SPA)

## Prerequisite

* yarn

## Building (webpack)

`yarn run build`

## Start

1. `yarn install`
2. `yarn run dev`
3. Visit in explorer: `http://localhost:8081`

### Branch naming rules

* Develop on branch `dev/{version}/{function name}`
* Test on branch `test`
* Fixed version on branch `dev/{version}`
* Production branch `production`

> Notice: development branch split from `dev/{last_version}`. If `dev/{last_version}` is not exist, split from `master`

#### Examples

`'dev/2.0.0/utf8' from 'dev/1.0.0' || 'master'`

### Router Rules

Files under `src/pages` path will follow the rules and auto generate routes and sub-routes, the level of routes is consistence with the folder path.

Define router alias in `src/router/config.js`

> Notice: The routes will generate only if `index.vue` exists in main folder.

#### Examples

`src/pages/trade/openOrders/index.vue` => `/tradeOpenOrders`

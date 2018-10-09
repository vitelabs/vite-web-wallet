# vite-web-wallet

## Prerequisites

* npm

## Building (webpack)

`npm run build`

## Starting

1. `npm install`
2. Configure eslint in your editor, rules like '.eslintrc'.
3. `npm run dev`

### Branch naming rules

* Develop on branch 'dev/{version}/{function name}'
* Test on branch 'test'
* Fixed version on branch 'dev/{version}'
* Production branch 'master'

> Notice: development branch split from `dev/{last_version}`. If `dev/{last_version}` is not exist, split from `master`

#### Examples

` 'dev/2.0.0/utf8' from 'dev/1.0.0' || 'master' `
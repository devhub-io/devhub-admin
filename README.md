# SPA
[![Node version](https://img.shields.io/badge/Node-%5E8.1.2-green.svg)]()
[![Vue version](https://img.shields.io/badge/Vue-%5E2.3.4-green.svg)]()
[![Element-UI version](https://img.shields.io/badge/Element--UI-%5E1.3.6-yellowgreen.svg)]()
[![build status](http://gitlab.zyx.dev/devhub/admin/badges/develop/build.svg)](http://gitlab.local/devhub/spa/commits/develop)

## 使用

基于 [vue-cli](https://github.com/vuejs/vue-cli) 模板.

``` bash
# 安装依赖关系
npm install

# 运行开发服务器 http://localhost:7003
npm run dev

# 生产打包
npm run build:prod

```

## 目录结构

* build - webpack config files
* config - webpack config files
* dist - build
* src - your app
    * api
    * assets
    * common
    * components - your vue components
    * mock
    * styles
    * views - your pages
    * vuex
    * App.vue
    * main.js - main file
    * routes.js
* static - static assets

## 主题

You can change theme by
1. Edit src/styles/vars.scss
2. Edit src/styles/element-variables.scss
3. Build theme
```
et -c ./src/styles/element-variables.css -o ./src/assets/theme/custom
```

## 支持浏览器

Modern browsers and Internet Explorer 10+.

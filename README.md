# Athena 组件平台

集合组件上传、组件拉取、和组件预览功能。

## 部署指引

``` bash
# 安装 NodeJS（建议版本>=6.0.0）
# 安装 MongoDB

git clone https://github.com/o2team/athena-component.git

cd athena-component
npm install
touch warehouse
touch database

cd app
npm install

# 前端调试 ./app
npm run dev
# 前端编译 ./app
npm run build

# 后端开发
npm run test

# 自定义配置 ac-config.json
```

## 技术组成

- 前端 vue+webpack
- 后端 koa
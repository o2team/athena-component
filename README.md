# Athena 组件平台

集合组件上传、组件拉取、和组件预览功能。

## 部署指引

``` bash
# 安装 NodeJS（建议版本>=6.0.0）
# 安装 MongoDB

git clone https://github.com/o2team/athena-component.git

cd athena-component/src
npm install
mkdir warehouse
mkdir database

cd app
npm install

# ----- #

# 前端调试 ./src/app -> http://localhost:8080/#!/list
npm run dev
# 前端编译 ./src/app -> http://localhost:8080/#!/list
npm run build

# 后端开发 ./src -> http://localhost/#!/list
mongod --dbpath ./database
npm run test

# 自定义配置 ac-config.json
```

## 技术组成

- 前端 vue+webpack
- 后端 koa
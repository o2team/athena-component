# Athena 组件平台

集合组件上传、组件拉取、和组件预览功能。

## 技术组成

- 前端 vue+webpack
- 后端 koa
- 数据存储 Leancloud

## 部署指引

``` bash
# 安装 NodeJS（建议版本>=6.0.0）
# 注册 Leancloud

git clone https://github.com/o2team/athena-component.git

cd athena-component/src
npm install
node install

cd app
npm install

# ----- #

# 前端配置
修改main.js里的数据配置项
# 代码主题
cp ./bak/athenac.js ./src/app/node_modules/brace/theme
# 主题切换
vi ./src/app/components/pages/pageDetail.vue 替换里面 "athenac"
# 前端调试 ./src/app -> 运行后访问：http://localhost:8080
npm run dev
# 前端编译 ./src/app
npm run build

# 后端配置
ac-config.js
# hack修改
cp ./bak/adm-zip.js ./src/node_modules/adm-zip/adm-zip.js
# 后端开发 ./src -> 运行后访问：http://localhost
npm run test

# ----- #

# 前后端双服务联调指引
（待更新）
```

## API

``` javascript
/**
 * HTTP POST /api/push
 * @description 上传组件
 *
 * @param appId <String> 应用ID
 * @param moduleId <String> 模块ID
 * @param platform <String> 平台 pc | h5
 * @param widget <String> zip组件打包文件，不包括外层文件夹，不要上传有组件依赖的组件
 * @param author <String> 作者，白名单校验
 * @param description [String] 描述，默认从组件配置文件中读取
 * 
 * @response 200 { no:0, data: { id: widgetId } }
 */
```

``` javascript
/**
 * HTTP GET /api/pull/:id/:rename?
 * @description 拉取组件
 * 
 * @param id <String> 组件ID
 * @param rename [String] 重命名名称
 */
```

``` javascript
/**
 * HTTP GET /api/detail?id=xxx
 * @description 组件详情，返回代码及组件信息
 * 
 * @param id <String> 组件ID
 *
 * @response { contHtml, contCss, contJs, widget }
 */
```

**Leancloud已提供相关接口，以下API不在后台提供：**

- 组件列表查询
- 白名单列表查询
- 白名单 增/删
- 组件标签 增/删

## Leancloud 初始化指引

Class: Widget, Account

- Widget: desc, **folder**, **name**, **author**, **appId**, **platform**(default h5), **moduleId**, **pullTimes**(default 0), tags(Array)
- Account（指定用户admin才可增删）: **name**


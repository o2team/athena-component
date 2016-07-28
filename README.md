# Athena 组件平台

集合组件上传、组件拉取、和组件预览功能。

## 部署指引

``` bash
# 安装 NodeJS（建议版本>=6.0.0）
# 安装 MongoDB

git clone https://github.com/o2team/athena-component.git

cd athena-component/src
npm install
node install

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

# ----- #

# 前后端“双服务器热替换模式”联调指引
# 1. 找到 ./src/app/webpack.config.js，将【单前端调试】部分注释，将【前后端联调】部分取消注释
# 2. 找到 ./src/app/index.html，修改打包文件的地址：dist/bundle.js改为http://localhost:8080/dist/bundle.js
# 3. 启动前端热更新服务
# 4. 启动后端服务，此时，如果前端文件有更新，浏览器会自动刷新
```

### 模块的修改

adm-zip糟点多

`/归档/adm-zip.js` 替换 `./src/node_modules/adm-zip/adm-zip.js`

（addLocalFolder 方法，约 Line 219）

![fix-adm-zip-add-folder](fix-adm-zip-add-folder.png)

### 代码主题

复制 `./归档/athenac.js` 到 `./src/app/node_modules/brace/theme` 下，可自行修改主题样式。

**主题切换：** 找到 `./src/app/components/pages/pageDetail.vue` 作如下修改（把 `athenac` 替换为已有主题的名字）：

``` javascript
...
require('brace/theme/athenac');
...
htmlEditor.setTheme('ace/theme/athenac');
...
cssEditor.setTheme('ace/theme/athenac');
...
jsEditor.setTheme('ace/theme/athenac');
```

## 技术组成

- 前端 vue+webpack
- 后端 koa

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
 * @param description [String] 描述，默认从组件配置文件中读取
 * @param author [String] 作者
 * 
 * @response 200 { no:0, data: { id: widgetId } }
 */

/**
 * HTTP GET /api/pull/:id/:rename?
 * @description 拉取组件
 * 
 * @param id <String> 组件ID
 * @param rename [String] 重命名名称
 */

/**
 * HTTP GET /api/detail?id=xxx
 * @description 组件详情，返回代码及组件信息
 * 
 * @param id <String> 组件ID
 *
 * @response { contHtml, contCss, contJs, widget }
 */

// 组件列表查询API不再在后台提供，详查Leancloud相关代码
```

** 下面两个API尚未健全及未转移到Leancloud **

- POST `/api/addtag`

	``` javascript
	{
		wid,	// 是mongodb里的_id，不是uuid
		tagname
	}
	```

	给组件添加标签

- POST `/api/removetag`

	``` javascript
	{
		wid,	// 是mongodb里的_id，不是uuid
		tagid
	}
	```
	
	移除组件的标签
'use strict';

const 
	Path = require('path');

module.exports = {
	// 运行端口
	port: process.env.PORT || 80,

	// 数据库
	mongodb: {
		// 'mongodb://username:password@host:port/database?options'
		uri: 'mongodb://localhost/acp',
		// 详查http://mongoosejs.com/docs/connections.html
		options: {}
	},
	
	leancloud: {
		APP_ID: 'ULAaHI9Bor3WJHCfORaRJ4BW-gzGzoHsz',
		APP_KEY: 'pRYLYgk6yk3aK2G9tNOWhd46'
	},

	// 前端目录
	app: Path.join(__dirname, 'app'),

	// 组件存放目录
	warehouse: Path.join(__dirname, 'warehouse'),

	// 数据文件存放目录
	dbdir: Path.join(__dirname, 'database'),

	tpl: {
		cssh5: `
* { -webkit-tap-highlight-color: transparent; outline: 0; margin: 0; padding: 0; vertical-align: baseline; }
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin: 0; padding: 0; vertical-align: baseline; }
img { border: 0 none; vertical-align: top; }
i, em { font-style: normal; }
ol, ul { list-style: none; }
input, select, button, h1, h2, h3, h4, h5, h6 { font-size: 100%; font-family: inherit; }
table { border-collapse: collapse; border-spacing: 0; }
a { text-decoration: none; color: #666; }
body { margin: 0 auto; min-width: 320px; max-width: 640px; height: 100%; font-size: 14px; font-family: Helvetica, STHeiti STXihei, Microsoft JhengHei, Microsoft YaHei, Arial; line-height: 1.5; color: #666; -webkit-text-size-adjust: 100% !important; text-size-adjust: 100% !important; }
input[type="text"], textarea { -webkit-appearance: none; -moz-appearance: none; appearance: none; }`,
		csspc: `
html, body, div, h1, h2, h3, h4, h5, h6, p, dl, dt, dd, ol, ul, li, fieldset, form, label, input, legend, table, caption, tbody, tfoot, thead, tr, th, td, textarea, article, aside, audio, canvas, figure, footer, header, mark, menu, nav, section, time, video { margin: 0; padding: 0; }
h1, h2, h3, h4, h5, h6 { font-size: 100%; font-weight: normal }
article, aside, dialog, figure, footer, header, hgroup, nav, section, blockquote { display: block; }
ul, ol { list-style: none; }
img { border: 0 none; vertical-align: top; }
blockquote, q { quotes: none; }
blockquote:before, blockquote:after, q:before, q:after { content: none; }
table { border-collapse: collapse; border-spacing: 0; }
strong, em, i { font-style: normal; font-weight: normal; }
ins { text-decoration: underline; }
del { text-decoration: line-through; }
mark { background: none; }
input::-ms-clear { display: none !important; }
body { font: 12px/1.5 \\5FAE\\8F6F\\96C5\9ED1, \\5B8B\\4F53, "Hiragino Sans GB", STHeiti, "WenQuanYi Micro Hei", "Droid Sans Fallback", SimSun, sans-serif; background: #fff; }
a { text-decoration: none; color: #333; }
a:hover { text-decoration: underline; }`
	}
}
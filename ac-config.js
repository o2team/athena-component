'use strict';

const 
	path = require('path');

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
	app: path.join(__dirname, 'app'),

	// 组件存放目录
	warehouse: path.join(__dirname, 'warehouse'),

	// 数据文件存放目录
	dbdir: path.join(__dirname, 'database'),

	logsDir: path.join(__dirname, 'logs'),
	
	tpl: {
		cssh5: `
html {font-size: 20px;}
blockquote,body,button,dd,dl,dt,fieldset,form,h1,h2,h3,h4,h5,h6,hr,input,legend,li,ol,p,pre,td,textarea,th,ul{margin:0;padding:0;vertical-align:baseline;-webkit-tap-highlight-color:transparent;outline:0}img{border:0;vertical-align:top}em,i{font-style:normal}ol,ul{list-style:none}button,h1,h2,h3,h4,h5,h6,input,select{font-size:100%;font-family:inherit}table{border-collapse:collapse;border-spacing:0}a{text-decoration:none}a,body{color:#666}body{margin:0 auto;height:100%;font-size:14px;font-family:-apple-system,Helvetica,sans-serif;line-height:1.5;-webkit-text-size-adjust:100%!important;text-size-adjust:100%!important;-webkit-user-select:none;-webkit-touch-callout:none}input[type=text],textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none}
body{font-family:STHeiti,Helvetica,sans-serif;}`,
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
## 模块修改说明

### Archiver

archiver 的 on('entry') 触发前时的状态已经是 `finalize:true`，即已经添加到压缩文件里了，但我们需要在文件添加到队列前重命名文件，因此在 `./node_modules/archiver/lib/core.js` 搜索 `Archiver.prototype._append = function(filepath, data)`，在它里面第一行添加 `this.onBeforeAppend && this.onBeforeAppend(filepath, data);`，如下：
	
``` javascript
Archiver.prototype._append = function(filepath, data) {
	this.onBeforeAppend && this.onBeforeAppend(filepath, data);
	/* ... */
};
```

如此，就可以在自己代码中自定义：

``` javascript
archive.onBeforeAppend = function(filePath, data) {
	// Do something. 这里是重命名
	data.name = new Date().getTime().toString();
}
```

后续：其实做到像 `on('beforeAppend', function() {})` 这样写，但还没摸透它，就酱
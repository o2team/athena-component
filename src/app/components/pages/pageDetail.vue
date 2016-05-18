<template>
<div class="page_detail">
	<div class="detail ly_box">
		<div class="detail_mobile">
			<div class="detail_mobile_screen">
				<iframe :src="'warehouse/'+$route.params.uuid+'/centroidnav.html'" frameborder="0" width="375px" height="667px"></iframe>
			</div>
		</div>
		<div class="detail_code">
			<h2 class="detail_code_tit">HTML结构</h2>
			<div id="htmlEditor"></div>
			<h2 class="detail_code_tit">CSS样式</h2>
			<div id="cssEditor"></div>
			<h2 class="detail_code_tit">脚本</h2>
			<div id="jsEditor"></div>
		</div>
	</div>
</div>
	<!-- {{$route.params.uuid}} -->
</template>

<style>
.page_detail {overflow:hidden;}
	.detail {}
		.detail_mobile {width:416px;}
			.detail_mobile_screen {position:relative;width:416px;height:848px;background:url(../../img/iphone.jpg);}
				.detail_mobile_screen iframe {position:absolute;top:76px;left:50%;margin:0 0 0 -187px;border:1px solid #ddd;background:url(../../img/transparent.png);}
		.detail_code {-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;}
			.detail_code_tit {margin:10px;font-size:20px;font-weight:normal;}
</style>

<script>
export default {
	ready () {
		let ace = require('brace');
		require('brace/mode/html');
		require('brace/mode/css');
		require('brace/mode/javascript');
		require('brace/theme/athenac');

		let htmlEditor = ace.edit('htmlEditor');
		htmlEditor.getSession().setMode('ace/mode/html');
		htmlEditor.getSession().setUseWrapMode(true);
		htmlEditor.setAutoScrollEditorIntoView(true);
		htmlEditor.setOption('maxLines', Infinity);
		htmlEditor.setTheme('ace/theme/athenac');

		let cssEditor = ace.edit('cssEditor');
		cssEditor.getSession().setMode('ace/mode/css');
		cssEditor.setAutoScrollEditorIntoView(true);
		cssEditor.setOption('maxLines', Infinity);
		cssEditor.setTheme('ace/theme/athenac');

		let jsEditor = ace.edit('jsEditor');
		jsEditor.getSession().setMode('ace/mode/javascript');
		jsEditor.setAutoScrollEditorIntoView(true);
		jsEditor.setOption('maxLines', Infinity);
		jsEditor.setTheme('ace/theme/athenac');

		this.$http.get('api/detail/'+this.$route.params.uuid, function(data) {
			htmlEditor.setValue(data.contHtml, 1);
			cssEditor.setValue(data.contCss, 1);
			jsEditor.setValue(data.contJs, 1);
			console.log(data);
		}).error(function(data, status, request) {
            console.log('fail' + status + "," + request);
        });
	}
}
</script>
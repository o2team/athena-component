<template>
<div class="page_detail">
	
	<div v-if="widget.platform==='pc'" class="detail_pc">
		<iframe :src="previewurl" frameborder="0" width="375px" height="667px"></iframe>
	</div>

	<div class="detail ly_box">

		<div v-if="widget.platform==='h5'" class="detail_mobile">
			<div class="detail_mobile_screen">
				<iframe :src="previewurl" frameborder="0" width="375px" height="667px"></iframe>
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
	<!-- {{$route.params.id}} -->
</template>

<style>
.page_detail {overflow:hidden;}
	.detail_pc {padding:10px 20px;border:1px solid #ddd;}
		.detail_pc iframe {width:100%;height:auto;}
	.detail {}
		.detail_mobile {width:416px;}
			.detail_mobile_screen {position:relative;width:416px;height:848px;background:url(../img/iphone.jpg);}
				.detail_mobile_screen iframe {position:absolute;top:76px;left:50%;margin:0 0 0 -187px;border:1px solid #ddd;background:url(../img/transparent.png);}
		.detail_code {padding:0 15px;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;}
			.detail_code_tit {margin:20px 0 10px;font-size:20px;font-weight:normal;}
</style>

<script>
export default {
	data () {
		return {
			previewurl: '',
			widget: {}
		}
	},
	ready () {
		let that = this;

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
		htmlEditor.setReadOnly(true);
		htmlEditor.$blockScrolling = Infinity;

		let cssEditor = ace.edit('cssEditor');
		cssEditor.getSession().setMode('ace/mode/css');
		cssEditor.getSession().setUseWrapMode(true);
		cssEditor.setAutoScrollEditorIntoView(true);
		cssEditor.setOption('maxLines', Infinity);
		cssEditor.setTheme('ace/theme/athenac');
		cssEditor.setReadOnly(true);
		cssEditor.$blockScrolling = Infinity;

		let jsEditor = ace.edit('jsEditor');
		jsEditor.getSession().setMode('ace/mode/javascript');
		jsEditor.getSession().setUseWrapMode(true);
		jsEditor.setAutoScrollEditorIntoView(true);
		jsEditor.setOption('maxLines', Infinity);
		jsEditor.setTheme('ace/theme/athenac');
		jsEditor.setReadOnly(true);
		jsEditor.$blockScrolling = Infinity;

  		this.$http.get('api/detail?id='+this.$route.params.id).then(function(res) {
  			let data = res.data;
			htmlEditor.setValue(data.contHtml, 1);
			cssEditor.setValue(data.contCss, 1);
			jsEditor.setValue(data.contJs, 1);
			that.$data.previewurl = `warehouse/_build/${ data.widget.folder }/index.html`;
			that.$data.widget = data.widget;
			console.log(data);
		}, function(data, status, request) {
            console.log('fail' + status + "," + request);
        });
	}
}
</script>
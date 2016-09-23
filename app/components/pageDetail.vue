<template>
<div class="pdetail">
	<div class="pdetail_info">
		<div class="pdetail_info_name">{{ widget.name }} <button class="pdetail_del">删除</button></div>
	</div>
	<div class="pdetail_tags">
		<ul>
			<li class="pdetail_tags_item" v-for="item in widget.tags"><a href="javascript:;">{{ item }}</a></li>
		</ul>
	</div>

	<div v-if="widget.platform==='pc' && contHtml" class="detail_pc">
		<iframe :src="previewurl" frameborder="0" width="375px" height="667px"></iframe>
	</div>

	<div class="detail ly_box">

		<div v-if="widget.platform==='h5' && contHtml" class="detail_mobile">
			<div class="detail_mobile_screen">
				<iframe :src="previewurl" frameborder="0" width="375px" height="667px"></iframe>
			</div>
		</div>
		
		<div class="detail_code">
			<div v-show="contHtml" class="conthtml">
				<h2 class="detail_code_tit"><div class="detail_code_tit_tab">HTML</div><div class="detail_code_tit_tab">HTML源码</div></h2>
				<div class="conthtml_built"><pre class="brush: xml;">{{ contBuiltHtml }}</pre></div>
				<div class="conthtml_raw"><pre class="brush: xml;">{{ contHtml }}</pre></div>
			</div>
			<div v-show="contScss" class="contscss">
				<h2 class="detail_code_tit"><div class="detail_code_tit_tab">编译样式</div><div class="detail_code_tit_tab">SASS源码</div></h2>
				<div class="contscss_built"><pre class="brush: scss;">{{ contBuiltCss }}</pre></div>
				<div class="contscss_raw"><pre class="brush: scss;">{{ contScss }}</pre></div>
			</div>
			<div v-show="contCss">
				<h2 class="detail_code_tit">CSS样式</h2>
				<pre class="brush: css;">{{ contCss }}</pre>
			</div>
			<div v-show="contJs">
				<h2 class="detail_code_tit">脚本</h2>
				<pre class="brush: js;">{{ contJs }}</pre>
			</div>
			<div v-show="contJson">
				<h2 class="detail_code_tit">组件配置</h2>
				<pre class="brush: js;">{{ contJson }}</pre>
			</div>
		</div>
	</div>
	
	<div class="pdetail_download">
		<input class="pdetail_download_rename" placeholder="重命名" v-model="rename">
		<a class="pdetail_download_btn" href="api/down/{{ widget.objectId }}/{{ rename }}">一键下载组件</a>
	</div>
</div>
</template>

<style lang="sass">
/* fix */
.syntaxhighlighter {padding: 1px;}

.pdetail {
	margin: 0 auto; max-width: 1400px;overflow:hidden;
	.pdetail_info {
		margin: 30px 0 0;
		.pdetail_info_name {padding: 10px 0; font-size: 24px; border-bottom: 1px solid #e4e4e4; text-align: center;}
		.pdetail_del {
			float: right;
			padding: 0 20px;
			background: #f03b55;
			border: 0;
			color: #fff;
			cursor: pointer;
			height: 30px;
			line-height: 30px;
		}
	}
	.pdetail_tags {
		padding: 10px 0;
		.pdetail_tags_item {
			display: inline-block; margin-right: 5px;
			a {
				display: inline-block;
				padding: 0 5px; height: 20px; line-height: 20px; font-size: 12px;
				color: rgb(97, 144, 232);
				background: rgba(97, 144, 232, .2);
				&:hover {
					background: rgb(97, 144, 232);
					color: #fff;
				}
			}
		}
	}

	.pdetail_download {
		position: fixed;
		bottom: 30px; right: 50px;	
		width: 180px;
	}
	.pdetail_download_rename {
		display: block;
		margin-bottom: -1px;
		width: 100%;
		line-height: 24px;
		border: 1px solid #6190e8;
		outline: 0;
		text-align: center;
	}
	.pdetail_download_btn {
		display: block;
		width: 100%;
		height: 28px; line-height: 28px;
		border: 1px solid #6190e8;
		background: #77A0EB;
		color: #fff;
		text-align: center;
		cursor: pointer;
		transition: .2s ease; will-change: background, color;
		&:hover {
			background: #6190e8;
			/*color: #333;*/
		}
	}
}

	.detail_pc {padding:10px 20px;border:1px solid #ddd;}
		.detail_pc iframe {width:100%;height:auto;}
	.detail {}
		.detail_mobile {width:416px;}
			.detail_mobile_screen {position:relative;width:416px;height:848px;background:url(../img/iphone.jpg);}
				.detail_mobile_screen iframe {position:absolute;top:76px;left:50%;margin:0 0 0 -187px;border:1px solid #ddd;background:url(../img/transparent.png);}
		.detail_code {padding:0 15px;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;}
			.detail_code_tit {margin:20px 0 10px;font-size:20px;font-weight:normal; overflow: hidden;}
				.detail_code_tit_tab {
					float: left;
					padding: 0 20px;
					border-bottom: 2px solid transparent;
					cursor: pointer;
					&.active {
						border-color: #f0b252;
					}
				}
</style>

<script>
export default {
	data () {
		return {
			contHtml: undefined,
			contBuiltHtml: undefined,
			contScss: undefined,
			contBuiltCss: undefined,
			contCss: undefined,
			contJs: undefined,
			contJson: undefined,
			previewurl: '',
			widget: {},
			rename: ''
		}
	},
	ready () {
		let that = this;
		var domContHtmlDetailCodeTitTabs = $('.conthtml .detail_code_tit_tab');
		var domContHtmlBuilt = $('.conthtml_built');
		var domContHtmlRaw = $('.conthtml_raw');
		var domContScssDetailCodeTitTabs = $('.contscss .detail_code_tit_tab');
		var domContScssBuilt = $('.contscss_built');
		var domContScssRaw = $('.contscss_raw');

  		this.$http.get('api/detail?id='+this.$route.params.id).then(function(res) {
  			let data = res.data;
			if(data.contHtml) { 
				that.$data.previewurl = `warehouse/_build/${ data.widget.objectId }/index.html`;
				that.$data.contHtml = data.contHtml;
				that.$data.contBuiltHtml = data.contBuiltHtml;

				// 初始化 HTML Tab
				domContHtmlBuilt.show();
				domContHtmlRaw.hide();
				domContHtmlDetailCodeTitTabs.eq(0).addClass('active');
				domContHtmlDetailCodeTitTabs.click(function() {
					var index = $(this).index();
					if(index===0) {
						domContHtmlBuilt.show();
						domContHtmlRaw.hide();
						domContHtmlDetailCodeTitTabs.removeClass('active');
						domContHtmlDetailCodeTitTabs.eq(0).addClass('active');
					} else if(index===1) {
						domContHtmlBuilt.hide();
						domContHtmlRaw.show();
						domContHtmlDetailCodeTitTabs.removeClass('active');
						domContHtmlDetailCodeTitTabs.eq(1).addClass('active');
					}
				});
			}
			if(data.contScss) { 
				that.$data.contScss = data.contScss;
				that.$data.contBuiltCss = data.contBuiltCss;

				// 初始化 SCSS Tab
				domContScssBuilt.show();
				domContScssRaw.hide();
				domContScssDetailCodeTitTabs.eq(0).addClass('active');
				domContScssDetailCodeTitTabs.click(function() {
					var index = $(this).index();
					if(index===0) {
						domContScssBuilt.show();
						domContScssRaw.hide();
						domContScssDetailCodeTitTabs.removeClass('active');
						domContScssDetailCodeTitTabs.eq(0).addClass('active');
					} else if(index===1) {
						domContScssBuilt.hide();
						domContScssRaw.show();
						domContScssDetailCodeTitTabs.removeClass('active');
						domContScssDetailCodeTitTabs.eq(1).addClass('active');
					}
				});
			}
			if(!data.contScss && data.contCss) { 
				that.$data.contCss = data.contCss;
			}
			if(data.contJs) { 
				that.$data.contJs = data.contJs;
			}
			if(data.contJson) { 
				that.$data.contJson = data.contJson;
			}

			// 等待页面更新
			setTimeout(function() {
				SyntaxHighlighter.highlight();
			}, 0);

			that.$data.widget = data.widget;
		}, function(data, status, request) {
            console.log('fail' + status + "," + request);
        });
	}
}
</script>
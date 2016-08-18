<template>
<div class="pdetail">
	<div class="pdetail_info">
		<div class="pdetail_info_name">{{ widget.name }}</div>
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
			<div v-show="contHtml">
				<h2 class="detail_code_tit">HTML结构</h2>
				<pre class="brush: xml;">{{ contHtml }}</pre>
			</div>
			<div v-show="contScss">
				<h2 class="detail_code_tit">SASS样式</h2>
				<pre class="brush: scss;">{{ contScss }}</pre>
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

	<a class="pdetail_download" href="api/pull/{{ widget.objectId }}">一键下载组件</a>
</div>
</template>

<style lang="sass">
.pdetail {
	margin: 0 auto; max-width: 1400px;overflow:hidden;
	.pdetail_info {
		margin: 30px 0 0;
		.pdetail_info_name {padding: 10px 0; font-size: 24px; border-bottom: 1px solid #e4e4e4; text-align: center;}
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
		display: block;
		padding: 0 20px;
		height: 28px; line-height: 28px;
		border: 1px solid #6190e8;
		background: #6190e8;
		color: #fff;
		cursor: pointer;
		transition: .2s ease; will-change: background, color;
		&:hover {
			background: #fff;
			color: #333;
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
			.detail_code_tit {margin:20px 0 10px;font-size:20px;font-weight:normal;}
</style>

<script>
export default {
	data () {
		return {
			contHtml: undefined,
			contScss: undefined,
			contCss: undefined,
			contJs: undefined,
			contJson: undefined,
			previewurl: '',
			widget: {}
		}
	},
	ready () {
		let that = this;

  		this.$http.get('api/detail?id='+this.$route.params.id).then(function(res) {
  			let data = res.data;
			if(data.contHtml) { 
				that.$data.previewurl = `warehouse/_build/${ data.widget.folder }/index.html`;
				that.$data.contHtml = data.contHtml;
			}
			if(data.contScss) { 
				that.$data.contScss = data.contScss;
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
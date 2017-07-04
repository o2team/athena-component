<template>
<div class="pdetail">
	<div class="pdetail_info">
		<div class="pdetail_info_name">{{widget.name}}</div>
	</div>
	<div class="pdetail_tags">
		<ul>
			<li class="pdetail_tags_item" v-for="item in widget.tags"><a href="javascript:;">{{item}}</a></li>
		</ul>
	</div>

	<div v-if="widget.platform === 1 && widgetDetail.contHtml" class="detail_pc">
		<iframe :src="previewurl" frameborder="0" width="375px" height="667px"></iframe>
	</div>

	<div class="detail ly_box">

		<div v-if="widget.platform === 0 && widgetDetail.contHtml" class="detail_mobile">
			<div class="detail_mobile_screen">
				<iframe :src="previewurl" frameborder="0" width="375px" height="667px"></iframe>
			</div>
		</div>

		<div class="detail_code">
			<div v-if="widgetDetail.contHtml" class="conthtml">
				<h2 class="detail_code_tit">
          <div @click="activeTabOfHtml = 0" :class="{active: activeTabOfHtml === 0}" class="detail_code_tit_tab">HTML</div>
          <div @click="activeTabOfHtml = 1" :class="{active: activeTabOfHtml === 1}" class="detail_code_tit_tab">HTML源码</div>
        </h2>
				<div v-show="activeTabOfHtml === 0" class="conthtml_built"><pre class="brush: xml;">{{widgetDetail.contBuiltHtml}}</pre></div>
				<div v-show="activeTabOfHtml === 1" class="conthtml_raw"><pre class="brush: xml;">{{widgetDetail.contHtml}}</pre></div>
			</div>
			<div v-if="widgetDetail.contScss" class="contscss">
				<h2 class="detail_code_tit">
          <div @click="activeTabOfCss = 0" :class="{active: activeTabOfCss === 0}" class="detail_code_tit_tab">编译样式</div>
          <div @click="activeTabOfCss = 1" :class="{active: activeTabOfCss === 1}" class="detail_code_tit_tab">SASS源码</div>
        </h2>
				<div v-show="activeTabOfCss === 0" class="contscss_built"><pre class="brush: scss;">{{widgetDetail.contBuiltCss}}</pre></div>
				<div v-show="activeTabOfCss === 1" class="contscss_raw"><pre class="brush: scss;">{{widgetDetail.contScss}}</pre></div>
			</div>
			<div v-if="!widgetDetail.contScss && widgetDetail.contCss">
				<h2 class="detail_code_tit">CSS样式</h2>
				<pre class="brush: css;">{{widgetDetail.contCss}}</pre>
			</div>
			<div v-if="widgetDetail.contJs">
				<h2 class="detail_code_tit">脚本</h2>
				<pre class="brush: js;">{{widgetDetail.contJs}}</pre>
			</div>
			<div v-if="widgetDetail.contJson">
				<h2 class="detail_code_tit">组件配置</h2>
				<pre class="brush: js;">{{widgetDetail.contJson}}</pre>
			</div>
		</div>
	</div>

	<div class="pdetail_download">
		<input class="pdetail_download_rename" placeholder="重命名" v-model="rename">
		<a class="pdetail_download_btn" :href="'api/down/' + widgetId + '/' + rename">一键下载组件</a>
	</div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SyntaxHighlighter, {registerBrush} from 'syntaxhighlighter'
import brushCss from 'brush-css'
import brushSass from 'brush-sass'
import brushJs from 'brush-javascript'
import brushXml from 'brush-xml'

registerBrush(brushCss)
registerBrush(brushSass)
registerBrush(brushJs)
registerBrush(brushXml)

export default {
	data () {
		return {
      widgetId: '',
      activeTabOfHtml: 0,
      activeTabOfCss: 0,
			rename: ''
		}
	},
  computed: {
    previewurl () {
      return `warehouse/${this.widgetId}/_preview_index.html`
    },
    widget () {
      return this.widgetDetail && this.widgetDetail.widget || {}
    },
    ...mapGetters({
      widgetDetail: 'widgetDetail'
    })
  },
  methods: {
    ...mapActions([
      'getWidgetDetail'
    ])
  },
	mounted () {
    this.widgetId = this.$route.params.id

    this.getWidgetDetail({id: this.widgetId})
	},
  watch: {
    widgetDetail () {
      this.$nextTick(() => {
        SyntaxHighlighter.highlight()
      })
    }
  }
}
</script>

<style lang="sass">
@import '../sass/theme';

/* fix */
.syntaxhighlighter {padding: 1px;}

.pdetail {
  margin: 0 auto;
  max-width: 1400px;
  overflow:hidden;
  min-height: 850px;
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
      .detail_mobile_screen {position:relative;width:416px;height:848px;background:url(../images/iphone.jpg);}
        .detail_mobile_screen iframe {position:absolute;top:76px;left:50%;margin:0 0 0 -187px;border:1px solid #ddd;background:url(../images/transparent.png);}
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

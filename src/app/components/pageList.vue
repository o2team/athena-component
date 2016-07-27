<template>
<div class="page_list">
	<ul class="witems">
		<li v-for="item in wlist" class="witems_it">
			<a v-link="{ name:'detail', params:{id:item.id} }">{{item.attributes.name}}</a>
		</li>
	</ul>
</div>
</template>

<style>
.page_list {}
	.page_list .witems {}
		.page_list .witems_it {display:inline-block;margin:0 10px 10px 0;border:1px solid #6190e8;}
			.page_list .witems_it a {display:block;padding:0 30px;height:24px;line-height:24px;font-size:12px;color:#6190e8;}
</style>

<script>
export default {
	ready () {
  		var that = this;

  		// 请求组件列表
		var query = new AV.Query('Widget');
		query.find().then(function (results) {
  			that.$set('wlist', results);
		}, function (error) {

		});

		return {}
	},
	data () {
		return {
			wlist: []
		}
	}
}
</script>
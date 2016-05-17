<template>
<div class="page_list">{{someData}}
	<ul class="witems">
		<li v-for="item in wlist" class="witems_it">
			<a v-link="{ name:'detail', params:{uuid:item.uuid} }">{{item.name}}</a>
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
		this.$http.get('api/list', function(data) {
			this.$set('wlist', data)
			console.log(data);
		}).error(function(data, status, request) {
            console.log('fail' + status + "," + request);
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
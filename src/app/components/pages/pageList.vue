<template>
	<div class="page_list">
		<ul class="witems">
			<li class="witems_it"><a href="#">slider</a></li>
		</ul>
	</div>
</template>

<style>
.page_list {}
	.witems {}
		.witems_it {display:inline-block;margin:0 10px 10px 0;border:1px solid #6190e8;}
			.witems_it a {display:block;padding:0 30px;height:24px;line-height:24px;font-size:12px;color:#6190e8;}
</style>

<script>
console.log(111)
export default {
	ready () {
		this.$http.get('api/list', function(data) {

		}).error(function(data, status, request) {
            console.log('fail' + status + "," + request);
        });
		return {}
	}
}
// console.log(this);
</script>
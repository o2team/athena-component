<template>
<div class="white">
	<table class="white_table">
		<thead><tr><th>Name</th><th class="white_item_handle">操作</th></tr></thead>
		<tbody>
			<tr class="white_item" v-for="item in wlist"><td>{{item.attributes.name}}</td><td class="white_item_handle"><button class="white_item_del">删除</button></td></tr>

			<tr class="white_item"><td><input type="text"></td><td class="white_item_handle"><button class="white_item_add">添加</button></td></tr>
		</tbody>
	</table>
</div>
</template>

<style>
.white {}
	.white_table {width: 100%; table-layout: fixed;}
		.white_table thead {border-bottom: 2px solid #ccc;}
			.white_table thead th {text-align: left;}
		.white_item {height:30px; border-bottom: 1px solid #ccc;}
			/*.white_item td {text-align: center;}*/
			.white_item td.white_item_handle {text-align: left;}
			.white_item button {width:80px;height:20px;background: transparent; border:0; border-radius:3px; cursor: pointer;}
			.white_item button.white_item_del {background: #E34231; color:#fff;}
			.white_item button.white_item_add {background: #009A61; color:#fff;}
</style>

<script>
export default {
	ready () {
  		var that = this;

  		// 请求白名单列表
		var query = new AV.Query('Account');
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
<template>
<div class="mod_wrap">
	<table class="white_table">
		<thead>
			<tr>
				<th>Name</th>
				<th>创建时间</th>
				<th class="white_item_handle">操作</th>
			</tr>
		</thead>
		<tbody>
			<tr class="white_item" v-for="item in wlist">
				<td>{{ item.attributes.name }}</td>
				<td>{{ item.createdAt | fmtDateNormal }}</td>
				<td class="white_item_handle">
					<a class="white_item_button del" @click="delAccount(item.id, $index)" href="javascript:;">删除</a>
				</td>
			</tr>
			
			<tr class="white_item">
				<td>
					<input class="white_item_input" type="text" v-model="addAccountName" placeholder="用户名">
				</td>
				<td></td>
				<td class="white_item_handle">
					<a class="white_item_button add" @click="addAccount(addAccountName)" href="javascript:;">添加</a>
				</td>
			</tr>
		</tbody>
	</table>
</div>
</template>

<style lang="sass">
.white_table {
	width: 100%; table-layout: fixed;
	thead {
		border-bottom: 2px solid #ccc;
		th {padding: 10px 10px; text-align: left;}
	}
}
.white_item {
	height:50px; border-bottom: 1px solid #ccc;
	td {
		padding:0 10px;
	}
	.white_item_button {
		display: inline-block;
		padding: 0 20px;
		height: 25px; line-height: 25px;
		background: transparent; border:0; border-radius:3px; letter-spacing: 1px; cursor: pointer;
		&.del {
			background: #E34231; color:#fff;
			&:hover {background: #E65647;}
		}
		&.add {
			background: #009A61; color:#fff;
			&:hover {background: #00B371;}
		}
	}
	.white_item_input {
		box-sizing: content-box;
		padding: 0;
		width: 100%; height: 30px;
		background-color: transparent;
		border: none; border-bottom: 1px solid #9e9e9e;
		border-radius: 0; outline: none; box-shadow: none;
		transition: all 0.3s;
		&:focus {
			border-bottom: 1px solid #26a69a;
			box-shadow: 0 1px 0 0 #26a69a;
		}
	}
}
</style>

<script>
export default {
	ready () {
  		var that = this;

  		// 请求白名单列表
		var query = new AV.Query('Account');
		query.find().then(function (results) {
  			that.wlist = results;
		}, function (error) {

		});

		return {}
	},
	data () {
		return {
			wlist: [],
			addAccountName: ''
		}
	},
	methods: {
		addAccount: function(addAccountName) {
			if(!addAccountName) {
				_POP_.toast('用户名为空');
				return;
			}
			var that = this;
			var nAccountObj = AV.Object.extend('Account');
			var nAccount = new nAccountObj();
			nAccount.set('name', addAccountName);
			nAccount.save().then(function(a) {
				that.wlist.push(a);
				_POP_.toast('添加成功');
			}, function(error) {
				_POP_.toast('添加失败');
			});
			this.$set('addAccountName', '');
		},
		delAccount: function(accountId, index) {
			var that = this;
			var account = AV.Object.createWithoutData('Account', accountId);
			account.destroy().then(function (success) {
				that.wlist.splice(index, 1);
  				_POP_.toast('删除成功');
			}, function (error) {
  				_POP_.toast('删除失败');
			});
		}
	}
}
</script>
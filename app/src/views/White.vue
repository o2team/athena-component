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
			<tr class="white_item" v-for="(item, index) in accountList">
				<td>{{item.name || item.attributes.name}}</td>
				<td>{{item.createdAt || item.attributes.createdAt | fmtDateNormal}}</td>
				<td class="white_item_handle">
					<a class="white_item_button del" @click="deletingAccount(item.objectId, index)" href="javascript:;">删除</a>
				</td>
			</tr>

			<tr class="white_item">
				<td>
					<input class="white_item_input" type="text" v-model="addAccountName" placeholder="用户名">
				</td>
				<td></td>
				<td class="white_item_handle">
					<a class="white_item_button add" @click="addingAccount(addAccountName)" href="javascript:;">添加</a>
				</td>
			</tr>
		</tbody>
	</table>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Utils from '@/utils'

export default {
  data () {
    return {
      wlist: [],
      addAccountName: ''
    }
  },
  computed: {
    ...mapGetters({
      accountList: 'accountList',
      accountAddStatus: 'accountAddStatus',
      accountDelStatus: 'accountDelStatus'
    })
  },
  methods: {
    ...mapActions([
      'getAccountList',
      'addAccount',
      'delAccount'
    ]),
    addingAccount (addAccountName) {
      if (!addAccountName) {
        Utils._POP_.toast('用户名为空')
        return
      }
      this.addAccount({name: addAccountName})
    },
    deletingAccount (accountId, index) {
      this.delAccount({id: accountId})
    }
  },
	mounted () {
		this.getAccountList()
	},
  watch: {
    accountAddStatus (val) {
      if (val === 0) {
        Utils._POP_.toast('添加成功')
      } else if (val === 1) {
        Utils._POP_.toast('添加失败')
      }
      this.addAccountName = ''
    },
    accountDelStatus (val) {
      if (val === 0) {
        Utils._POP_.toast('删除成功')
      } else if (val === 1) {
        Utils._POP_.toast('删除失败')
      }
    }
  }
}
</script>

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
</style>

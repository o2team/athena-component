import * as URL from '@/config/URL'
import Vue from 'vue'

const ACCOUNT_LIST = 'ACCOUNT_LIST'
const ACCOUNT_ADD = 'ACCOUNT_ADD'
const ACCOUNT_DEL = 'ACCOUNT_DEL'

const state = {
  accountList: [],
  accountAddStatus: -1,
  accountDelStatus: -1
}
const getters = {
  accountList: state => state.accountList,
  accountAddStatus: state => state.accountAddStatus,
  accountDelStatus: state => state.accountDelStatus
}

const mutations = {
  [ACCOUNT_LIST] (state, {list = []}) {
    state.accountList = list
  },
  [ACCOUNT_ADD] (state, {status, account}) {
    state.accountAddStatus = status
    if (status === 0 && account) {
      console.log(account)
      state.accountList.unshift(account)
      state.accountList = [...state.accountList]
    }
  },
  [ACCOUNT_DEL] (state, {status, index}) {
    state.accountDelStatus = status
    if (status === 0) {
      state.accountList.splice(index, 1)
      state.accountList = [...state.accountList]
    }
  }
}

const actions = {
  getAccountList ({commit}) {
    Vue.http.get(URL.ACCOUNT_LIST).then((res) => {
      if (res.ok) {
        commit(ACCOUNT_LIST, { list: res.data })
      }
    })
  },
  addAccount ({commit}, {name}) {
    commit(ACCOUNT_ADD, { status: -1 })
    const Account = Parse.Object.extend('Account')
    const account = new Account()
    account.set('name', name)
    account.save().then((item) => {
      commit(ACCOUNT_ADD, { status: 0, account: item })
    }).catch((error) => {
      commit(ACCOUNT_ADD, { status: 1 })
    })
  },
  delAccount ({commit}, {id, index}) {
    commit(ACCOUNT_DEL, { status: -1 })
    const Account = Parse.Object.extend('Account')
    const account = Account.createWithoutData(id)
    account.destroy().then(() => {
      commit(ACCOUNT_DEL, { status: 0, index })
    }).catch((error) => {
      commit(ACCOUNT_DEL, { status: 1 })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

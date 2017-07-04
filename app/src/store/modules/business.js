import * as URL from '@/config/URL'
import Vue from 'vue'

const BUSINESS_LIST = 'BUSINESS_LIST'

const state = {
  businessList: []
}
const getters = {
  businessList: state => state.businessList
}

const mutations = {
  [BUSINESS_LIST] (state, {list = []}) {
    state.businessList = list
  }
}

const actions = {
  getBusinessList ({commit}) {
    Vue.http.get(URL.BUSINESS_LIST).then((res) => {
      if (res.ok) {
        commit(BUSINESS_LIST, {
          list: res.data
        })
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

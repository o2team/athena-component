import * as URL from '@/config/URL'
import Vue from 'vue'

const CLASSIFY_LIST = 'CLASSIFY_LIST'

const state = {
  classifyList: []
}
const getters = {
  classifyList: state => state.classifyList
}

const mutations = {
  [CLASSIFY_LIST] (state, {list = []}) {
    state.classifyList = list
  }
}

const actions = {
  getClassifyList ({commit}) {
    Vue.http.get(URL.CLASSIFY_LIST).then((res) => {
      if (res.ok) {
        commit(CLASSIFY_LIST, {
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

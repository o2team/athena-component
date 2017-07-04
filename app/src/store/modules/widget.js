/**
 * 组件
 * @cdate 2017-07
 * getters:
    - widgetList + widgetListEnd
    - widgetDelStatus
    - widgetDetail
 * actions:
    - getWidgetList
    - delWidget
    - getWidgetDetail
 */

import * as URL from '@/config/URL'
import Vue from 'vue'

const WIDGET_LIST = 'WIDGET_LIST'
const WIDGET_DEL = 'WIDGET_DEL'
const WIDGET_DETAIL = 'WIDGET_DETAIL'

let _widgetDetails = {}

const state = {
  widgetList: [],
  widgetListEnd: false,
  widgetDelStatus: -1,
  widgetDetail: {}
}
const getters = {
  widgetList: state => state.widgetList,
  widgetListEnd: state => state.widgetListEnd,
  widgetDelStatus: state => state.widgetDelStatus,
  widgetDetail: state => state.widgetDetail
}

const mutations = {
  [WIDGET_LIST] (state, {list = [], added}) {
    if (added) {
      if (list.length === 0) {
        state.widgetListEnd = true
        return
      }
      state.widgetList = state.widgetList.concat(list)
    } else {
      state.widgetListEnd = false
      state.widgetList = list
    }
  },
  [WIDGET_DEL] (state, {status, index}) {
    state.widgetDelStatus = status
    state.widgetList.splice(index, 1)
    state.widgetList = [...state.widgetList]
  },
  [WIDGET_DETAIL] (state, {detail = {}, id}) {
    state.widgetDetail = detail
    if (id) {
      _widgetDetails[id] = detail
    }
  }
}

const actions = {
  /**
   * @param keyword {String}
   * @param business {String}
   * @param classify {String}
   * @param page {Number}
   * @param size {Number}
   */
  getWidgetList ({commit}, {keyword, business, classify, page = 0, size = 20, added}) {
    // @todo 每個業務的組件個數
    Vue.http.get(URL.WIDGET_LIST, {
      keyword,
      business,
      classify,
      page,
      size
    }).then((res) => {
      if (res.ok) {
        commit(WIDGET_LIST, { list: res.data, added })
      } else {
        commit(WIDGET_LIST, { list: [], added })
      }
    }).catch((error) => {
      commit(WIDGET_LIST, { list: [], added })
    })
  },
  delWidget ({commit}, {id, index}) {
    commit(WIDGET_DEL, { status: -1 })
    Vue.http.get(`${URL.WIDGET_DEL}/${id}`).then((res) => {
      if (res.ok) {
        commit(WIDGET_DEL, { status: 0, index })
      } else {
        commit(WIDGET_DEL, { status: 1 })
      }
    }).catch((error) => {
      commit(WIDGET_DEL, { status: 1 })
    })
  },
  getWidgetDetail ({commit}, {id}) {
    commit(WIDGET_DETAIL, { detail: {} })
    if (_widgetDetails[id]) {
      commit(WIDGET_DETAIL, { detail: _widgetDetails[id] })
      return
    }
    Vue.http.get(`${URL.WIDGET_DETAIL}/${id}`).then((res) => {
      if (res.ok) {
        commit(WIDGET_DETAIL, { detail: res.data, id })
      } else {
        commit(WIDGET_DETAIL, { detail: {} })
      }
    }).catch((error) => {
      commit(WIDGET_DETAIL, { detail: {} })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

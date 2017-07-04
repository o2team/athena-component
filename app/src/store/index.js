import Vue from 'vue'
import Vuex from 'vuex'

import session from './modules/session'
import widget from './modules/widget'
import business from './modules/business'
import classify from './modules/classify'
import account from './modules/account'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    session,
    widget,
    business,
    classify,
    account
  },
  strict: debug
})

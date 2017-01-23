import 'babel-polyfill'
import Vue from 'vue'
import VueResource from 'vue-resource'

import router from './router'
import store from './store'
import mixins from './mixins'
import * as filters from './filters'

import App from './App.vue'

Vue.use(VueResource)
Vue.mixin(mixins)

Vue.config.debug = true;

// Prod
var APP_ID = 'ULAaHI9Bor3WJHCfORaRJ4BW-gzGzoHsz'
var APP_KEY = 'pRYLYgk6yk3aK2G9tNOWhd46'
// Dev
var APP_ID = 'au4n3kqk359vDNoUWJHe3pJ2-gzGzoHsz'
var APP_KEY = 'k7F8i5aRninXmrUpdR5CCEBI'

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: 'App',
  store,
  router,
  render: (createElement) => createElement(App)
})

import 'babel-polyfill'
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'

import router from './router'
import store from './store'
import mixins from './mixins'
import * as filters from './filters'

import App from './App.vue'

Vue.use(VueResource)
Vue.use(VueLazyload, {
  // error: 'src/images/loading.gif',
  loading: 'src/images/loading.gif',
  attempt: 2
})
Vue.mixin(mixins)

Vue.config.debug = true

// Parse
Parse.initialize('cj44zwy3w00000f659ubkvzhq', 'cj44zwy3x00020f65e7h1ebfa')
Parse.serverURL = 'http://quark.jd.com/j44zwy3w0000/'

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: 'App',
  store,
  router,
  render: (createElement) => createElement(App)
})

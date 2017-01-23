import Vue from 'vue'
import Router from 'vue-router'

import Header from '../components/Header.vue'
import Clist from '../views/Clist.vue'
import Detail from '../views/Detail.vue'
import White from '../views/White.vue'

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

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      name: 'list',
      path: '/list',
      meta: {
        title: '组件列表'
      },
      components: {
        default: Clist,
        header: Header
      }
    },
    {
      name: 'detail',
      path: '/detail/:id',
      meta: {
        title: '组件详情'
      },
      components: {
        default: Detail,
        header: Header
      }
    },
    {
      name: 'white',
      path: '/white',
      meta: {
        title: '白名单',
        auth: true
      },
      components: {
        default: White,
        header: Header
      }
    },
    {
      path: '*',
      redirect: '/list'
    }
  ]
})

router.beforeEach((to, from, next) => {
  let auth = to.meta.auth

  if (!auth || AV.User.current()) {
    next()
  } else {
    // @todo 路障
  }
})

export default router

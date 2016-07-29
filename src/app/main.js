import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter);
Vue.use(VueResource);

import App from './components/App.vue'
import pageList from './components/pageList.vue'
import pageDetail from './components/pageDetail.vue'
import pageWhite from './components/pageWhite.vue'

Vue.config.debug = true;

var router = new VueRouter();

// 应用 ID，用来识别应用
var APP_ID = 'FzixJuDzAVtFSG2FP705KgEo-gzGzoHsz';
// 应用 Key，用来校验权限（Web 端可以配置安全域名来保护数据安全）
var APP_KEY = 'dx4IHFu1FbFBB88Pn61GLGGP';
// 初始化
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

router.map({
    '/list': {
    	name: 'list',
        component: pageList
    },
    '/detail/:id': {
    	name: 'detail',
    	component: pageDetail
    },
    '/white': {
        name: 'white',
        component: pageWhite
    }
});

router.start(App, 'App');

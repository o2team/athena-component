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

// FILTER
Vue.filter('fmtDateNormal', function(text) {
    var past = new Date(text);

    if(past=='Invalid Date') { return ''; }

    var now = new Date(),
        septime = now.getTime() - past.getTime();

    // 大于7天
    if(septime>604800000) {
        if(now.getFullYear()-past.getFullYear()>0) {
            return past.getFullYear()+'年'+(past.getMonth()+1)+'月'+past.getDate()+'日';
        } else {
            return (past.getMonth()+1)+'月'+past.getDate()+'日';
        }
    } else if(septime>86400000) {
        return Math.floor(septime/86400000)+'天前';
    } else if(septime>3600000) {
        return Math.floor(septime/3600000)+'小时前';
    } else if(septime>60000) {
        return Math.floor(septime/60000)+'分钟前';
    } else {
        return Math.floor(septime/1000)+'秒前';
    }
});

// ROUTER
router.map({
    // default
    '/': {
        name: 'list',
        component: pageList
    },
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

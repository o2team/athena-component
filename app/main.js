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

var APP_ID = 'ULAaHI9Bor3WJHCfORaRJ4BW-gzGzoHsz';
var APP_KEY = 'pRYLYgk6yk3aK2G9tNOWhd46';
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
Vue.filter('ngLikeFilter', function(arr, property, equalTo) {
    if(!property || !equalTo) {
        return arr;
    }
    var newArr = [];
    for(var i=0; i<arr.length;i++) {
        if(arr[i][property] && arr[i][property] == equalTo) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
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
        component: pageWhite,
        auth: true
    }
});

router.beforeEach(function (transition) {
  var auth = transition.to.auth;
  var currentUser = AV.User.current();
  Vue.nextTick(function(){
    router.app.$broadcast('Auth', currentUser);
  });
  
  if (!auth) {
    transition.next();
  } else {
    if (currentUser) {
        transition.next();
    } else {
        transition.abort();
    }
  }
})

router.start(App, 'App');

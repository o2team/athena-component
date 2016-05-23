import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter);
Vue.use(VueResource);

import App from './components/App.vue'
import pageList from './components/pages/pageList.vue'
import pageDetail from './components/pages/pageDetail.vue'

Vue.config.debug = true;

var router = new VueRouter();

router.map({
    '/list': {
    	name: 'list',
        component: pageList
    },
    '/detail/:uuid': {
    	name: 'detail',
    	component: pageDetail
    }
});

router.start(App, 'body');
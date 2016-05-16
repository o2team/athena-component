import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter);
Vue.use(require('vue-resource'));

import App from './components/App.vue'
import pageList from './components/pages/pageList.vue'

Vue.config.debug = true;

var router = new VueRouter();

router.map({
    '/list': {
        component: pageList
    }
});

router.start(App, 'body');